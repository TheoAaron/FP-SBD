export default function EditProfile() {
  return (
    <div className="flex-1 py-3 px-6">
      <h2 className="text-xl font-semibold text-red-500 mb-6">Edit Your Profile</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input type="text" defaultValue="Md" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input type="text" defaultValue="Rimel" className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" defaultValue="rimel111@gmail.com" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input type="text" defaultValue="Kingston, 5236, United State" className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Password Changes</label>
          <input type="password" placeholder="Current Password" className="w-full p-2 border rounded" />
          <input type="password" placeholder="New Password" className="w-full p-2 border rounded" />
          <input type="password" placeholder="Confirm New Password" className="w-full p-2 border rounded" />
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button type="button" className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
