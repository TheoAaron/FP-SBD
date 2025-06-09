import Link from 'next/link';

export default function ProfileSidebar() {
  return (
    <aside className="w-64 p-4 border-r min-h-screen">
      <nav className="space-y-4">
        <div className="block font-bold">
          Manage My Account
        </div>
        <Link href="/order" className="block hover:underline">
          My Orders
        </Link>
        <Link href="/wishlist" className="block hover:underline">
          My WishList
        </Link>
      </nav>
    </aside>
  );
}