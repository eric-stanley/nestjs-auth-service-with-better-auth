import { Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter extends BaseExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        if (exception.code === 11000) {
            // Duplicate key error
            throw new ConflictException('Entity with that unique field already exists');
        }
        // Let others bubble up or handle more codes here
        super.catch(exception as any, host);
    }
}
