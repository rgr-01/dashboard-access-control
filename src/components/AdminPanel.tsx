
import { useState } from 'react';
import { User, UserRole } from '@/types/user';
import { getAllUsers, addUser, updateUser, deleteUser } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Edit, Trash2, UserPlus, Key } from 'lucide-react';
import { AnimatedTransition } from './ui-components/AnimatedTransition';

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'pecas' as UserRole,
    password: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const roles: {value: UserRole, label: string}[] = [
    { value: 'pecas', label: 'Peças' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'gerente', label: 'Gerente' },
    { value: 'admin', label: 'Administrador' }
  ];
  
  const refreshUsers = () => {
    setUsers(getAllUsers());
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as UserRole }));
  };
  
  const handleAddUser = () => {
    try {
      if (!formData.username || !formData.name || !formData.password) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
      
      addUser(formData);
      refreshUsers();
      setIsAddDialogOpen(false);
      setFormData({ username: '', name: '', role: 'pecas', password: '' });
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleEditUser = () => {
    try {
      if (!selectedUser || !formData.username || !formData.name) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
      
      const { password, ...userData } = formData;
      updateUser(selectedUser.id, userData);
      refreshUsers();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleChangePassword = () => {
    try {
      if (!selectedUser) return;
      
      if (passwordData.password !== passwordData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
      
      if (!passwordData.password) {
        toast.error('A senha não pode estar vazia');
        return;
      }
      
      updateUser(selectedUser.id, { password: passwordData.password });
      setIsPasswordDialogOpen(false);
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      try {
        deleteUser(user.id);
        refreshUsers();
      } catch (error: any) {
        console.error(error);
      }
    }
  };
  
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      role: user.role,
      password: ''
    });
    setIsEditDialogOpen(true);
  };
  
  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setPasswordData({ password: '', confirmPassword: '' });
    setIsPasswordDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto p-4">
      <AnimatedTransition>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Gerenciamento de Usuários</span>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo usuário.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Ex: joao.silva"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: João Silva"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Perfil</Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleAddUser}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Gerencie os usuários do sistema, seus perfis e permissões.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome de Usuário</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openPasswordDialog(user)}
                        title="Alterar senha"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(user)}
                        title="Editar usuário"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteUser(user)}
                        title="Excluir usuário"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedTransition>
      
      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere os dados do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-username">Nome de Usuário</Label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Perfil</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleEditUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Alteração de Senha */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Alterar senha do usuário ${selectedUser.name}` : 'Alterar senha'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                name="password"
                type="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleChangePassword}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
