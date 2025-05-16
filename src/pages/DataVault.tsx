import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Shield, Eye, EyeOff, Check } from "lucide-react";
import { Switch } from "../components/ui/switch";
import { useToast } from "../components/ui/use-toast";
import { useUser } from "../contexts/UserContext";

interface DataItem {
  id: string;
  category: string;
  name: string;
  value: string;
  protected: boolean;
  sensitive: boolean;
}

export default function DataVault() {
  const { user } = useUser();
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [newItem, setNewItem] = useState({ category: "", name: "", value: "" });
  const [vaultAccessGranted, setVaultAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (vaultAccessGranted && user) {
      fetchVaultData();
    }
  }, [vaultAccessGranted, user]);

  const fetchVaultData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/vault?username=${user?.username}`);
      if (response.ok) {
        const data = await response.json();
        setDataItems(data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch vault data",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error connecting to server",
      });
    }
  };

  const saveVaultData = async (updatedData: DataItem[]) => {
    try {
      const response = await fetch(`http://localhost:4000/api/vault?username=${user?.username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        toast({
          title: "Vault Updated",
          description: "Your data vault has been updated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update vault data",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error connecting to server",
      });
    }
  };

  const toggleProtection = (id: string) => {
    const updated = dataItems.map(item =>
      item.id === id ? { ...item, protected: !item.protected } : item
    );
    setDataItems(updated);
    saveVaultData(updated);
  };

  const toggleShowValue = (id: string) => {
    setShowValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addNewItem = () => {
    if (!newItem.category || !newItem.name || !newItem.value) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please fill in all fields to add a new data item.",
      });
      return;
    }
    const newId = (dataItems.length + 1).toString();
    const updated = [
      ...dataItems,
      {
        id: newId,
        category: newItem.category,
        name: newItem.name,
        value: newItem.value,
        protected: true,
        sensitive: true,
      }
    ];
    setDataItems(updated);
    setNewItem({ category: "", name: "", value: "" });
    saveVaultData(updated);
  };

  const deleteItem = (id: string) => {
    const updated = dataItems.filter(item => item.id !== id);
    setDataItems(updated);
    saveVaultData(updated);
  };

  const categories = Array.from(new Set(dataItems.map(item => item.category)));

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check for demo; in real app use biometric or secure auth
    if (passwordInput === "vaultpassword") {
      setVaultAccessGranted(true);
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Incorrect password",
      });
    }
  };

  if (!vaultAccessGranted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <form onSubmit={handleAccessSubmit} className="space-y-4 max-w-sm w-full">
          <Label htmlFor="vault-password">Enter Vault Password</Label>
          <Input
            id="vault-password"
            type="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            placeholder="Password"
          />
          <Button type="submit" className="w-full">Unlock Vault</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Vault</h1>
        <p className="text-muted-foreground">Securely manage your personal data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Add New Data to Protect
          </CardTitle>
          <CardDescription>
            Add personal information you want WatchTower to monitor and protect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Personal, Financial"
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Data Name</Label>
              <Input
                id="name"
                placeholder="e.g., Email, Phone Number"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                placeholder="The actual data value"
                value={newItem.value}
                onChange={e => setNewItem({...newItem, value: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addNewItem}>Add to Vault</Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold">{category} Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {dataItems
                .filter(item => item.category === category)
                .map(item => (
                  <Card key={item.id} className={item.protected ? "border-primary/30" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant={item.protected ? "default" : "outline"}>
                          {item.protected ? "Protected" : "Unprotected"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-mono bg-muted px-2 py-1 rounded text-sm">
                            {showValues[item.id] || !item.sensitive ? item.value : "••••••••••••"}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleShowValue(item.id)}
                            className="h-8 w-8"
                          >
                            {showValues[item.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.protected}
                            onCheckedChange={() => toggleProtection(item.id)}
                          />
                          <Label htmlFor={`protected-${item.id}`}>
                            {item.protected ? 
                              <span className="text-xs flex items-center text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </span> : 
                              <span className="text-xs text-muted-foreground">Inactive</span>
                            }
                          </Label>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => deleteItem(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
