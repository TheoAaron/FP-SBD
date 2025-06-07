import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex justify-between p-4 bg-blue-500 text-white">
      <h1 className="text-lg font-bold">E-Shop</h1>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
      </div>
    </nav>
  );
};

export default Navbar;
