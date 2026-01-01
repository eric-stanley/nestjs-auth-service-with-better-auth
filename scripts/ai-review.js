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
Output format:
{
  "summary": "",
  "critical": [],
  "warnings": [],
  "suggestions": [],
  "files": { "filename": "review_data" }
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

    console.log(`${REVIEW_TAG}\n${output}`);

    // Fail build on critical issues
    if (output.includes('"critical": [') && !output.includes('"critical": []')) {
        console.error("❌ Critical issues found.");
    }

    const dir = ".ai-reviews";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const reviewPath = path.join(dir, `${timestamp}.md`);
    const latestPath = path.join(dir, "latest.md");

    const markdown = renderMarkdown(JSON.parse(output));

    fs.writeFileSync(reviewPath, markdown);
    fs.writeFileSync(latestPath, markdown);

    console.log(`AI review saved to ${reviewPath}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

function renderMarkdown(review) {
    const status = review.critical?.length ? "❌ FAIL" : "✅ PASS";

    const section = (title, items = []) =>
        items.length
            ? `## ${title}\n\n${items.map(i => `- ${i}`).join("\n")}\n\n`
            : "";

    const filesTable = review.files
        ? `
## 📂 File-Level Notes

| File | Review |
|------|--------|
${Object.entries(review.files)
            .map(([file, note]) => {
                const text = typeof note === 'object' ? JSON.stringify(note) : note;
                return `| \`${file}\` | \```json\n${text}\n\``` |`;
            })
            .join("\n")}
`
        : "";

    return `# 🤖 AI Code Review

**Status:** ${status}  
**Timestamp:** ${new Date().toISOString()}

---

## 🧾 Summary
${review.summary}

---

${section("❌ Critical Issues", review.critical)}
${section("⚠️ Warnings", review.warnings)}
${section("💡 Suggestions", review.suggestions)}

${filesTable}

---

*Generated automatically by AI Review Bot*
`;
}
