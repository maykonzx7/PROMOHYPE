import User from './models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB');

    const { username, password } = process.argv[2] ? JSON.parse(process.argv[2]) : {};
    
    if (!username || !password) {
      console.error('Uso: node create_admin.js \'{"username":"admin","password":"senha123"}\'');
      process.exit(1);
    }

    // Verificar se o usuário já existe
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`Usuário "${username}" já existe.`);
      process.exit(0);
    }

    // Criar novo usuário admin
    const adminUser = new User({
      username,
      password, 
      role: 'admin'
    });

    await adminUser.save();
    console.log(`Usuário administrador "${username}" criado com sucesso!`);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();