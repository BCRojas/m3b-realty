import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, X, Upload, Briefcase, Loader2, Lock, ShieldCheck, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TeamMember } from "@shared/schema";

export default function MarketingTeam() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      return;
    }
    setPassword("");
    setPasswordError("");
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAdmin(true);
        setIsPasswordDialogOpen(false);
        setPassword("");
      } else {
        setPasswordError("Incorrect password. Please try again.");
      }
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const { data: team = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
    queryFn: async () => {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Failed to fetch team");
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (member: { name: string; role: string; imageUrl: string; portfolioUrl: string }) => {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      if (!res.ok) throw new Error("Failed to add member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name?: string; role?: string; imageUrl?: string } }) => {
      const res = await fetch(`/api/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove member");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      const reader = new FileReader();
      reader.onload = () => setEditPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearEditFile = () => {
    setEditFile(null);
    setEditPreviewUrl(editingMember?.imageUrl || null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditRole(member.role);
    setEditFile(null);
    setEditPreviewUrl(member.imageUrl);
    setIsEditDialogOpen(true);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole) return;

    let imageUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800";

    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) return;
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.imageUrl;
    }

    addMutation.mutate({
      name: newName,
      role: newRole,
      imageUrl,
      portfolioUrl: "#",
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setNewName("");
        setNewRole("");
        clearFile();
      },
    });
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editName || !editRole) return;

    const updates: { name?: string; role?: string; imageUrl?: string } = {};

    if (editName !== editingMember.name) updates.name = editName;
    if (editRole !== editingMember.role) updates.role = editRole;

    if (editFile) {
      const formData = new FormData();
      formData.append("photo", editFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) return;
      const uploadData = await uploadRes.json();
      updates.imageUrl = uploadData.imageUrl;
    }

    if (Object.keys(updates).length === 0) {
      setIsEditDialogOpen(false);
      return;
    }

    updateMutation.mutate({ id: editingMember.id, data: updates }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingMember(null);
        setEditFile(null);
        setEditPreviewUrl(null);
      },
    });
  };

  return (
    <section id="marketing-team" className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-sm font-bold text-red tracking-wider uppercase mb-2 font-heading">Our People</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-navy font-heading" data-testid="text-marketing-team-title">
              Marketing Team
            </h3>
          </div>

          <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-lg">
            {isAdmin && <ShieldCheck className="w-4 h-4 text-green-600" />}
            <span className="text-sm font-medium text-muted-foreground">
              {isAdmin ? "Admin Active" : "Admin Mode"}
            </span>
            <button
              data-testid="button-admin-toggle"
              onClick={handleAdminToggle}
              className={`w-12 h-6 rounded-full transition-colors relative ${isAdmin ? 'bg-navy' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isAdmin ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogContent className="sm:max-w-[380px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading text-navy flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Admin Access
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">Enter the admin password to enable editing.</p>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    data-testid="input-admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-sm text-red font-medium" data-testid="text-password-error">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white" data-testid="button-submit-password" disabled={isVerifying}>
                  {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Unlock Admin Mode
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-navy" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card key={member.id} className="overflow-hidden border-0 shadow-lg group relative" data-testid={`card-team-member-${member.id}`}>
                {isAdmin && (
                  <>
                    <button
                      data-testid={`button-edit-member-${member.id}`}
                      onClick={() => openEditDialog(member)}
                      className="absolute top-4 left-4 z-10 p-2 bg-navy text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-navy/90 shadow-md"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      data-testid={`button-remove-member-${member.id}`}
                      onClick={() => removeMutation.mutate(member.id)}
                      className="absolute top-4 right-4 z-10 p-2 bg-red text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red/90 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                <div className="aspect-[3/4] overflow-hidden relative">
                  <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-0"></div>
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 text-center bg-white relative z-10 -mt-6 mx-4 rounded-t-xl shadow-sm">
                  <h4 className="text-xl font-bold text-navy font-heading mb-1" data-testid={`text-member-name-${member.id}`}>{member.name}</h4>
                  <p className="text-red font-medium text-sm" data-testid={`text-member-role-${member.id}`}>{member.role}</p>
                </CardContent>
              </Card>
            ))}

            {isAdmin && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/30 shadow-none bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[400px] h-full" data-testid="card-add-member">
                    <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-navy/60" />
                    </div>
                    <h4 className="text-lg font-bold text-navy/60 font-heading">Add Team Member</h4>
                    <p className="text-sm text-muted-foreground mt-2 px-6 text-center">Upload a photo and details for your new marketing team member.</p>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading text-navy">Add Team Member</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddMember} className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        data-testid="input-member-name"
                        placeholder="e.g. Jane Doe"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role / Position</Label>
                      <Input
                        id="role"
                        data-testid="input-member-role"
                        placeholder="e.g. Marketing Specialist"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Photo</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        data-testid="input-member-photo-file"
                      />
                      {previewUrl ? (
                        <div className="relative rounded-lg overflow-hidden border border-input">
                          <img src={previewUrl} alt="Preview" className="w-full aspect-[3/4] object-cover" />
                          <button
                            type="button"
                            onClick={clearFile}
                            className="absolute top-2 right-2 p-1.5 bg-red text-white rounded-full hover:bg-red/90 shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
                          data-testid="button-upload-photo"
                        >
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground font-medium">Click to upload a photo</span>
                          <span className="text-xs text-muted-foreground">JPG, PNG, GIF, WEBP (max 10MB)</span>
                        </button>
                      )}
                      <p className="text-xs text-muted-foreground">Leave blank to use a placeholder image.</p>
                    </div>
                    <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white" data-testid="button-submit-member" disabled={addMutation.isPending}>
                      {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Add to Team
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading text-navy">Edit Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditMember} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  data-testid="input-edit-member-name"
                  placeholder="e.g. Jane Doe"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role / Position</Label>
                <Input
                  id="edit-role"
                  data-testid="input-edit-member-role"
                  placeholder="e.g. Marketing Specialist"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Photo</Label>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleEditFileChange}
                  className="hidden"
                  data-testid="input-edit-member-photo-file"
                />
                {editPreviewUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-input">
                    <img src={editPreviewUrl} alt="Preview" className="w-full aspect-[3/4] object-cover" />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-3 py-1.5 bg-navy text-white rounded-md text-xs font-medium hover:bg-navy/90 shadow-md flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
                    data-testid="button-edit-upload-photo"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">Click to upload a new photo</span>
                  </button>
                )}
              </div>
              <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white" data-testid="button-save-edit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
