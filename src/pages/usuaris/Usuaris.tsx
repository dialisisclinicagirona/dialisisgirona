import React, { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../../lib/supabaseClient';
import Top from '../topMenu/Top';
import InputText from '../common/TextInput';
import SelectInput from '../common/SelectInput';

// Define the Perfil type based on the task description
interface Perfil {
  id: string;
  nom: string;
  email: string;
  rol: string;
  email_confirmed_at?: string | null;
  invitation_sent_at?: string | null;
}

const Usuaris = () => {
  const [perfils, setPerfils] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // For the invitation form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('usuari'); // Default role
  const [inviteMessage, setInviteMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  // For editing user
  const [editingUser, setEditingUser] = useState<Perfil | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // Fetch all profiles and check if current user is admin
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        
        if (user) {
          // Check if current user is admin
          const { data: userProfile, error: profileError } = await supabase
            .from('perfils')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          setIsAdmin(userProfile?.rol === 'admin');
        }
        
        // Fetch all profiles
        const { data, error } = await supabase
          .from('perfils')
          .select('*')
          .order('nom');
        
        if (error) throw error;
        
        // If admin, get verification status for all users
        if (isAdmin) {
          const userIds = data?.map(profile => profile.id) || [];
          
          // Get user auth data for all profiles
          const authUsers = await Promise.all(
            userIds.map(async (userId) => {
              try {
                const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
                if (userError) throw userError;
                return userData?.user;
              } catch (err) {
                console.error(`Error fetching auth data for user ${userId}:`, err);
                return null;
              }
            })
          );
          
          // Combine profile data with auth data
          const profilesWithAuth = data?.map((profile, index) => {
            const authUser = authUsers[index];
            return {
              ...profile,
              email_confirmed_at: authUser?.email_confirmed_at,
              invitation_sent_at: authUser?.created_at // Using created_at as proxy for invitation sent date
            };
          });
          
          setPerfils(profilesWithAuth || []);
        } else {
          setPerfils(data || []);
        }
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);
  
  // Handle sending invitation
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setInviteMessage({ text: 'Només els administradors poden enviar invitacions', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Send invitation email using Supabase Auth with admin privileges
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(inviteEmail,
        {
          redirectTo: 'https://dialisisgirona.vercel.app/set-password',
        }
      );
      console.log(data, error);
      if (error) throw error;
      
      // Create profile entry for the invited user
      if (data?.user?.id) {
        const { error: profileError } = await supabase
          .from('perfils')
          .insert([
            { 
              id: data.user.id, 
              username:inviteEmail,
              nom: inviteName, 
              email: inviteEmail, 
              rol: inviteRole 
            }
          ]);
        
        if (profileError) throw profileError;
      }
      
      // Reset form and show success message
      setInviteEmail('');
      setInviteName('');
      setInviteRole('usuari');
      setInviteMessage({ text: 'Invitació enviada correctament', type: 'success' });
      
      // Refresh profiles list
      const { data: updatedProfiles, error: fetchError } = await supabase
        .from('perfils')
        .select('*')
        .order('nom');
      
      if (fetchError) throw fetchError;
      
      setPerfils(updatedProfiles || []);
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      setInviteMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deleting a user
  const handleDeleteUser = async (id: string) => {
    if (!isAdmin) {
      setError('Només els administradors poden eliminar usuaris');
      return;
    }
    
    if (!window.confirm('Estàs segur que vols eliminar aquest usuari?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Delete user from auth system with admin privileges
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      
      if (authError) throw authError;
      
      // Delete profile entry
      const { error: profileError } = await supabase
        .from('perfils')
        .delete()
        .eq('id', id);
      
      if (profileError) throw profileError;
      
      // Update local state
      setPerfils(perfils.filter(perfil => perfil.id !== id));
      setError(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(`Error eliminant usuari: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle editing a user
  const handleEditUser = (perfil: Perfil) => {
    setEditingUser(perfil);
    setEditName(perfil.nom);
    setEditRole(perfil.rol);
  };
  
  // Handle saving edited user
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    if (!isAdmin) {
      setError('Només els administradors poden modificar usuaris');
      return;
    }
    
    try {
      setLoading(true);
      
      // Update profile entry
      const { error } = await supabase
        .from('perfils')
        .update({ 
          nom: editName, 
          rol: editRole 
        })
        .eq('id', editingUser.id);
      
      if (error) throw error;
      
      // Update local state
      setPerfils(perfils.map(perfil => 
        perfil.id === editingUser.id 
          ? { ...perfil, nom: editName, rol: editRole } 
          : perfil
      ));
      
      // Reset editing state
      setEditingUser(null);
      setError(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(`Error actualitzant usuari: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <>
      <Top />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gestió d'Usuaris</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Only show invitation form for admins */}
        {isAdmin && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Convidar Nou Usuari</h2>
            
            {inviteMessage && (
              <div className={`${inviteMessage.type === 'success' ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'} border px-4 py-3 rounded mb-4`}>
                {inviteMessage.text}
              </div>
            )}
            
            <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-2">
                <InputText
                  label='Nom'
                  value={inviteName}
                  prop='nom'
                  onValueChanged={(e) => setInviteName(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/3 px-2">
                <InputText
                label='Email'
                value={inviteEmail}
                prop='email'
                onValueChanged={(e) => setInviteEmail(e.target.value)}
                />
                
              </div>
              
              <div className="w-full md:w-1/3 px-2">
                <SelectInput
                label='Rol'
                value={inviteRole}
                prop='rol'
                options={[
                  { id: 'usuari', nom: 'Usuari' },
                  { id: 'admin', nom: 'Administrador' },
                ]}
                onValueChanged={(e) => setInviteRole(e.target.value)}
                />
                
              </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0097A7] hover:bg-[#007D90] text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? 'Enviant...' : 'Enviar Invitació'}
              </button>
            </form>
          </div>
        )}
        
        {/* Users list */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verificació
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && perfils.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Carregant usuaris...
                  </td>
                </tr>
              ) : perfils.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hi ha usuaris disponibles
                  </td>
                </tr>
              ) : (
                perfils.map((perfil) => (
                  <tr key={perfil.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editingUser?.id === perfil.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border rounded-md px-2 py-1 w-full"
                        />
                      ) : (
                        perfil.nom
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {perfil.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingUser?.id === perfil.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="border rounded-md px-2 py-1 w-full"
                        >
                          <option value="usuari">Usuari</option>
                          <option value="admin">Administrador</option>
                        </select>
                      ) : (
                        perfil.rol
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {perfil.email_confirmed_at ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Verificat
                        </span>
                      ) : (
                        <div>
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pendent
                          </span>
                          {perfil.invitation_sent_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              Invitació: {new Date(perfil.invitation_sent_at).toLocaleDateString('ca-ES')}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingUser?.id === perfil.id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-900"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel·lar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(perfil)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Editar
                            </button>
                            {/* Don't allow deleting yourself */}
                            {perfil.id !== currentUser?.id && (
                              <button
                                onClick={() => handleDeleteUser(perfil.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!isAdmin && (
          <div className="mt-4 text-sm text-gray-500">
            Només els administradors poden gestionar els usuaris.
          </div>
        )}
      </div>
    </>
  );
};

export default Usuaris;