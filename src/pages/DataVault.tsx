
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface DataItem {
  id: string;
  category: string;
  name: string;
  value: string;
  protected: boolean;
  sensitive: boolean;
}

const initialData: DataItem[] = [
  { id: "1", category: "Personal", name: "Full Name", value: "John Doe", protected: true, sensitive: true },
  { id: "2", category: "Personal", name: "Email", value: "john.doe@example.com", protected: true, sensitive: true },
  { id: "3", category: "Personal", name: "Phone", value: "+1 (555) 123-4567", protected: false, sensitive: true },
  { id: "4", category: "Financial", name: "Credit Card", value: "**** **** **** 4321", protected: true, sensitive: true },
  { id: "5", category: "Address", name: "Home Address", value: "123 Privacy St, Secureville", protected: false, sensitive: true },
  { id: "6", category: "Personal", name: "Date of Birth", value: "01/15/1985", protected: true, sensitive: true },
  { id: "7", category: "Online", name: "Username", value: "jdoe85", protected: false, sensitive: false },
  { id: "8", category: "Financial", name: "Bank Account", value: "****6789", protected: true, sensitive: true },
];

export default function DataVault() {
  const [dataItems, setDataItems] = useState<DataItem[]>(initialData);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [newItem, setNewItem] = useState({ category: "", name: "", value: "" });
  const { toast } = useToast();

  const toggleProtection = (id: string) => {
    setDataItems(items => 
      items.map(item => 
        item.id === id ? { ...item, protected: !item.protected } : item
      )
    );
    
    toast({
      title: "Protection Status Updated",
      description: "Your data protection preferences have been updated.",
    });
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
    setDataItems(prev => [
      ...prev, 
      { 
        ...newItem, 
        id: newId, 
        protected: true, 
        sensitive: true 
      }
    ]);
    
    setNewItem({ category: "", name: "", value: "" });
    
    toast({
      title: "Data Item Added",
      description: "New data item has been added to your vault and is now protected.",
    });
  };

  const categories = Array.from(new Set(dataItems.map(item => item.category)));

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
