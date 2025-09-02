// This is a script to set up the Supabase storage buckets for certificates
// Run this script after setting up your Supabase project

console.log("⚙️ Setting up certificate storage");
console.log("1. Create a 'event-certificates' bucket in your Supabase storage");
console.log("2. Set the bucket privacy to 'private'");
console.log("3. Add appropriate RLS policies:");
console.log("   - Allow authenticated users to download their own certificates");
console.log("   - Allow admins to upload/manage certificate templates");

console.log("\nRLS Policy examples:");
console.log(`
-- For downloading certificates
CREATE POLICY "Allow users to download their own certificates" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'event-certificates' AND auth.uid() IN (
  SELECT "User".id FROM "User"
  JOIN "EventRegistration" ON "User"."supabaseId" = "EventRegistration"."userId"
  JOIN "Event" ON "EventRegistration"."eventId" = "Event"."id"
  WHERE "Event"."certificate_template_url" = storage.filename(name)
));

-- For uploading certificate templates
CREATE POLICY "Allow admins to upload certificate templates" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'event-certificates' AND
  EXISTS (
    SELECT 1 FROM "User" 
    WHERE "User"."supabaseId" = auth.uid() 
    AND ("User"."role" = 'ADMIN' OR "User"."role" = 'MASTER')
  )
);

-- For updating certificate templates
CREATE POLICY "Allow admins to update certificate templates" 
ON storage.objects FOR UPDATE 
TO authenticated 
WITH CHECK (
  bucket_id = 'event-certificates' AND
  EXISTS (
    SELECT 1 FROM "User" 
    WHERE "User"."supabaseId" = auth.uid() 
    AND ("User"."role" = 'ADMIN' OR "User"."role" = 'MASTER')
  )
);
`);

console.log("\n✅ Certificate setup guide complete");
