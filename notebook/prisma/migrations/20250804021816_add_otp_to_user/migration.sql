/*
  Warnings:

  - Added the required column `expiresAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "otp" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
