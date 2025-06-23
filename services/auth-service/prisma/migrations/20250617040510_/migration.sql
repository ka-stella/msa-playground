-- CreateTable
CREATE TABLE "auth_users" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password_hash" TEXT,
    "provider" TEXT,
    "provider_user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_username_key" ON "auth_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_provider_provider_user_id_key" ON "auth_users"("provider", "provider_user_id");
