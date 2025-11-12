/*
  Warnings:

  - You are about to alter the column `companySize` on the `company` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `company` MODIFY `companySize` ENUM('SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_501_1000', 'SIZE_1001_PLUS') NOT NULL;
