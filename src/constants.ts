import { PrismaClient } from '@prisma/client';
import { Router } from "express";

export const prismaClient = new PrismaClient();
export const router = Router();