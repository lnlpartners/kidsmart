
import React, { useState, useEffect } from "react";
import { Child } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ChildrenList from "../components/children/ChildrenList";
import AddChildForm from "../components/children/AddChildForm";

export default function ChildrenPage() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null); // New state for editing
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setIsLoading(true);
    const data = await Child.list('-created_date');
    setChildren(data);
    setIsLoading(false);
  };

  const handleAddChild = async (childData) => {
    if (editingChild) {
      await Child.update(editingChild.id, childData);
    } else {
      await Child.create(childData);
    }
    setShowAddForm(false);
    setEditingChild(null); // Reset editingChild after submission
    loadChildren();
  };

  const handleEditChild = (child) => {
    setEditingChild(child);
    setShowAddForm(true);
  };

  const handleDeleteChild = async (childId) => {
    if (window.confirm('Are you sure you want to delete this child? This will also delete all their assignments and practice questions.')) {
      await Child.delete(childId);
      loadChildren();
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingChild(null); // Reset editingChild on cancel
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Manage Children</h1>
            <p className="text-gray-600 mt-1">Add and manage your children's profiles</p>
          </div>
          <Button
            onClick={() => {
              setEditingChild(null); // Ensure no child is being edited when adding new
              setShowAddForm(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Child
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {editingChild ? `Edit ${editingChild.name}` : 'Add New Child'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddChildForm
                child={editingChild} // Pass the child data for pre-filling the form
                onSubmit={handleAddChild}
                onCancel={handleCancelForm} // Use the new cancel handler
              />
            </CardContent>
          </Card>
        )}

        <ChildrenList
          children={children}
          isLoading={isLoading}
          onEdit={handleEditChild} // New prop for editing
          onDelete={handleDeleteChild}
        />
      </div>
    </div>
  );
}
