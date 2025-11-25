// scripts/createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Verificar se já existe algum usuário admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log("Já existe um usuário admin no sistema.");
      process.exit(0);
    }
    
    // Criar usuário admin
    const adminUser = new User({
      username: "admin",
      password: "admin123", // Em produção, use uma senha mais segura
      role: "admin"
    });
    
    await adminUser.save();
    console.log("Usuário admin criado com sucesso!");
    console.log("Username: admin");
    console.log("Senha: admin123");
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
    process.exit(1);
  }
}

createAdmin();