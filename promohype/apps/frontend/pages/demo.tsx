import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { Skeleton } from '@/components/atoms/skeleton';

export default function UIDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Demonstração UI</h1>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground mt-2">
            Veja como os componentes do ShadCN se comportam com os temas claro e escuro
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cards */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Cards</h2>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Card de Exemplo</CardTitle>
                <CardDescription>Descrição do card</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Este é um card de exemplo com conteúdo dentro.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary">Ação</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Inputs and Forms */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nome@exemplo.com" />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
            </div>
          </div>

          {/* Select and Buttons */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Select & Botões</h2>
            <div className="space-y-4">
              <Select defaultValue="option1">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Opção 1</SelectItem>
                  <SelectItem value="option2">Opção 2</SelectItem>
                  <SelectItem value="option3">Opção 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button>Primário</Button>
                <Button variant="secondary">Secundário</Button>
                <Button variant="outline">Contorno</Button>
                <Button variant="ghost">Fantasma</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Conta</TabsTrigger>
                <TabsTrigger value="password">Senha</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciar Conta</CardTitle>
                    <CardDescription>
                      Configure as configurações da sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label>Nome</Label>
                      <Input placeholder="Nome" />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input placeholder="Email" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Salvar alterações</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>
                      Atualize sua senha
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label>Senha Atual</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label>Nova Senha</Label>
                      <Input type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Salvar senha</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Skeleton */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Skeleton</h2>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}