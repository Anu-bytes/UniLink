-- CreateTable
CREATE TABLE "SavedFaculty" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedFaculty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedFaculty_userId_idx" ON "SavedFaculty"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedFaculty_userId_facultyId_key" ON "SavedFaculty"("userId", "facultyId");

-- AddForeignKey
ALTER TABLE "SavedFaculty" ADD CONSTRAINT "SavedFaculty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFaculty" ADD CONSTRAINT "SavedFaculty_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
