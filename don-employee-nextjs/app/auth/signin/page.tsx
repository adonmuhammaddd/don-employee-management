export default function SignInPage() {
  return (
    <form>
      <h2 className="text-lg font-semibold mb-4">Sign In</h2>
      <input className="w-full border p-2 mb-4" placeholder="Email" />
      <input className="w-full border p-2 mb-4" placeholder="Password" type="password" />
      <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
    </form>
  );
}