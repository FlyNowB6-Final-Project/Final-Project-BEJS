/*
  Warnings:

  - Changed the type of `birth_date` on the `passengers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "passengers_identity_number_key";

-- AlterTable
ALTER TABLE "passengers" ALTER COLUMN "age_group" DROP NOT NULL,
DROP COLUMN "birth_date",
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;
