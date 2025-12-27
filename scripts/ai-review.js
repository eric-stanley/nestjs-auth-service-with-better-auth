import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const REVIEW_TAG = "[AI-CODE-REVIEW]";
const MAX_CHARS = 12000;

// ---------- helpers ----------

function run(cmd) {
    return execSync(cmd, { encoding: "utf-8" }).trim();
}

function getChangedFiles() {
    try {
        return run("git diff --name-only origin/main...HEAD")
            .split("\n")
            .filter(Boolean);
    } catch {
        return [];
    }
}

function getAllFiles() {
    return run("git ls-files")
        .split("\n")
        .filter(f =>
            f.match(/\.(ts|js|json|yml|yaml|graphql)$/)
        );
}

function readFileSafe(file) {
    try {
        const content = fs.readFileSync(file, "utf-8");
        return content.length > MAX_CHARS
            ? content.slice(0, MAX_CHARS) + "\n/* truncated */"
            : content;
    } catch {
        return null;
    }
}

// ---------- review detection ----------

function isFirstReview() {
    try {
        const comments = run(
            `gh pr view --json comments -q '.comments[].body'`
        );
        return !comments.includes(REVIEW_TAG);
    } catch {
        // On push (not PR), treat as full review
        return true;
    }
}

// ---------- prompt ----------

function buildPrompt(files, mode) {
    let fileBlock = "";

    for (const file of files) {
        const content = readFileSafe(file);
        if (!content) continue;

        fileBlock += `
FILE: ${file}
----------------------------------
${content}
----------------------------------
`;
    }

    return `
You are a senior security-focused NestJS architect.

Context:
- Auth microservice
- NestJS + GraphQL Federation
- Mongoose
- Redis sessions
- Better-auth
- RBAC

Review Mode: ${mode}

Rules:
- Focus on auth, RBAC, Redis, GraphQL
- Ignore formatting unless dangerous
- Be precise and actionable
- Output JSON only

Output format:
{
  "summary": "",
  "critical": [],
  "warnings": [],
  "suggestions": [],
  "files": {}
}

Files to review:
${fileBlock}
`;
}

// ---------- main ----------

async function main() {
    const firstReview = isFirstReview();
    const files = firstReview ? getAllFiles() : getChangedFiles();

    if (!files.length) {
        console.log("No files to review.");
        return;
    }

    const prompt = buildPrompt(
        files,
        firstReview ? "FULL_REVIEW" : "INCREMENTAL"
    );

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
    });

    const output = response.choices[0].message.content;

    const bodyFile = ".ai-review-comment.md";

    // Write the AI output to a file
    fs.writeFileSync(bodyFile, output, "utf8");

    // Post comment using file
    execSync(`gh pr comment --body-file ${bodyFile}`, {
        stdio: "inherit",
    });

    console.log(`${REVIEW_TAG}\n${output}`);

    // Fail build on critical issues
    if (output.includes('"critical": [') && !output.includes('"critical": []')) {
        console.error("❌ Critical issues found.");
        process.exit(1);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
