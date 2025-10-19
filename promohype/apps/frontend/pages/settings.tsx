import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <ThemeToggle />
          </div>
        </header>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>
                  Gerencie as preferências de aparência do aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Escuro</Label>
                    <div className="text-sm text-muted-foreground">
                      Alterne entre os modos claro e escuro
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema Preferido</Label>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Atualize suas informações de conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Atualizar Conta</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}