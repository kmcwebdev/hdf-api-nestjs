-- CreateTable
CREATE TABLE "visitor_sub_emails" (
    "id" SERIAL NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitor_sub_emails.email_unique" ON "visitor_sub_emails"("email");

-- AddForeignKey
ALTER TABLE "visitor_sub_emails" ADD FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
