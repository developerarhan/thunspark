import { db } from '../src/lib/db/client';
import { hashPassword } from '../src/lib/auth/password';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'admin@thunspark.agency';
  const adminName = process.env.ADMIN_NAME?.trim() || 'ThunSpark Super Admin';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ThunSpark@2026!';

  console.log(`🌱 Seeding initial Super Admin: ${adminEmail}...`);

  const hashedPassword = hashPassword(adminPassword);

  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'SUPER_ADMIN',
      name: adminName,
    },
    create: {
      email: adminEmail,
      name: adminName,
      role: 'SUPER_ADMIN',
      hashedPassword,
    },
  });

  console.log(`✅ Super Admin ready with ID: ${admin.id}`);
  console.log('--------------------------------------------------');
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${process.env.ADMIN_INITIAL_PASSWORD ? '********' : 'ThunSpark@2026! (Default)'}`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
