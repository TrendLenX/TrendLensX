import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SEOHead from '@/components/SEO/SEOHead';
import { users, freezeUser, unfreezeUser, removeUser, User } from '@/data/users';

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>(users);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      signIn();
      return;
    }

    if (session.user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  const handleFreezeUser = (userId: string) => {
    freezeUser(userId);
    setUserList([...users]);
  };

  const handleUnfreezeUser = (userId: string) => {
    unfreezeUser(userId);
    setUserList([...users]);
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      removeUser(userId);
      setUserList([...users]);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <>
      <SEOHead
        title="Admin - User Management"
        description="Manage website users"
      />

      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userList.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.frozen ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.frozen ? 'Frozen' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {user.frozen ? (
                      <button
                        onClick={() => handleUnfreezeUser(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Unfreeze
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFreezeUser(user.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Freeze
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}