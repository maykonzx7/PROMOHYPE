import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Teste de criação de token
console.log('Testando sistema de autenticação...\n');

// Teste 1: Verificação do segredo JWT
const secret = process.env.JWT_SECRET || 'default_secret_key';
console.log('1. Verificando segredo JWT:', secret !== 'default_secret_key' ? 'OK (segredo configurado)' : 'ATENÇÃO (usando segredo padrão)');

// Teste 2: Criar e verificar token
try {
  const testPayload = { id: 'test123', username: 'testuser', role: 'admin' };
  const testToken = jwt.sign(testPayload, secret, { expiresIn: '24h' });
  console.log('2. Criação de token: OK');

  jwt.verify(testToken, secret, (err, decoded) => {
    if (err) {
      console.log('2. Verificação de token: FALHOU -', err.message);
    } else {
      console.log('2. Verificação de token: OK');
      console.log('   Payload decodificado:', decoded);
    }
  });
} catch (error) {
  console.log('2. Teste de token: FALHOU -', error.message);
}

// Teste 3: Verificar se o modelo User está funcionando
console.log('\n3. Testando modelo de usuário...');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('   Conexão com MongoDB: OK');

    // Teste de hash de senha
    try {
      const testUser = new User({
        username: 'test_auth_user',
        password: 'test_password123',
        role: 'user'
      });

      // O middleware pre-save deve hashear a senha automaticamente
      await testUser.save();
      console.log('   Hash de senha: OK');
      console.log('   Senha hasheada:', testUser.password.length > 10 ? 'OK (senha hasheada)' : 'ERRO (senha não hasheada)');

      // Teste de comparação de senha
      const isMatch = await testUser.comparePassword('test_password123');
      console.log('   Comparação de senha:', isMatch ? 'OK' : 'FALHOU');

      // Limpar: remover usuário de teste
      await User.deleteOne({ username: 'test_auth_user' });
      console.log('   Limpeza: OK');
    } catch (error) {
      console.log('   Teste de modelo de usuário: FALHOU -', error.message);
    }

    // Teste 4: Verificar se existem usuários admin no banco de dados
    try {
      const adminUsers = await User.find({ role: 'admin' });
      console.log(`\n4. Usuários administradores encontrados: ${adminUsers.length}`);
      if (adminUsers.length > 0) {
        console.log('   Usuários admin:');
        adminUsers.forEach(user => {
          console.log(`     - ${user.username} (ID: ${user._id})`);
        });
      } else {
        console.log('   Nenhum usuário admin encontrado. Primeiro acesso - você precisará criar um usuário admin.');
      }
    } catch (error) {
      console.log('   Falha ao verificar usuários admin:', error.message);
    }

    mongoose.disconnect();
    console.log('\nTeste de autenticação concluído!');
  })
  .catch(err => {
    console.log('Falha na conexão com MongoDB:', err.message);
  });