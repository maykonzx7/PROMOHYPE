import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Rota para login de usuário
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Procurar usuário no banco de dados
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '24h' } // Token expira em 24 horas
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no login." });
  }
});

// Rota para registro
router.post("/register", authenticateToken, async (req, res) => {
  try {
    // Verifica se o usuário tem permissão para criar outros usuários
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Acesso negado. Permissões administrativas necessárias." });
    }

    const { username, password, role = 'user' } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Nome de usuário já existe." });
    }

    // Criar novo usuário
    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({
      message: "Usuário criado com sucesso.",
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Rota protegida para testar autenticação
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Perfil acessado com sucesso", user: req.user });
});

export default router;