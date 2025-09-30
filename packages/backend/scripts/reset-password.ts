import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'contact@georgesedimo.com';
  const newPassword = 'password123'; // Changez ceci si vous voulez

  console.log(`🔄 Réinitialisation du mot de passe pour ${email}...`);

  // Hasher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Mettre à jour l'utilisateur
  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log(`✅ Mot de passe réinitialisé avec succès pour ${user.email}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Nouveau mot de passe: ${newPassword}`);
  console.log(`\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !`);

  await prisma.$disconnect();
}

resetPassword()
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
