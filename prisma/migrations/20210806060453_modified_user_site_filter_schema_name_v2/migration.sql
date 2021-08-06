-- CreateTable
CREATE TABLE "UserSiteFilter" (
    "id" SERIAL NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserSiteFilter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SiteToUserSiteFilter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserSiteFilter_AB_unique" ON "_UserToUserSiteFilter"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserSiteFilter_B_index" ON "_UserToUserSiteFilter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SiteToUserSiteFilter_AB_unique" ON "_SiteToUserSiteFilter"("A", "B");

-- CreateIndex
CREATE INDEX "_SiteToUserSiteFilter_B_index" ON "_SiteToUserSiteFilter"("B");

-- AddForeignKey
ALTER TABLE "_UserToUserSiteFilter" ADD FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserSiteFilter" ADD FOREIGN KEY ("B") REFERENCES "UserSiteFilter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteToUserSiteFilter" ADD FOREIGN KEY ("A") REFERENCES "sites"("siteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteToUserSiteFilter" ADD FOREIGN KEY ("B") REFERENCES "UserSiteFilter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
