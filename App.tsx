import { useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { CategorySelector } from './components/CategorySelector';
import { useChat } from './hooks/useChat';
import { ChatCategory, HealthProfile } from './types/medical';
import { AlertCircle } from 'lucide-react';

function App() {
  const [hasSubmittedProfile, setHasSubmittedProfile] = useState(false);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    name: '',
    age: '',
    weight: '',
    height: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    dietaryRestrictions: '',
  });
  const [category, setCategory] = useState<ChatCategory>('general');
  const { messages, isLoading, error, sendMessage, handleReaction } = useChat(category);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHealthProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedProfile(true); // Move to chat view after form submission
  };

  const handleEndChat = () => {
    setHasSubmittedProfile(false); // Reset to the form
    setHealthProfile({
      name: '',
      age: '',
      weight: '',
      height: '',
      medicalConditions: '',
      allergies: '',
      medications: '',
      dietaryRestrictions: '',
    });
  };

  if (!hasSubmittedProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Enter Your Health Profile</h1>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={healthProfile.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              name="age"
              value={healthProfile.age}
              onChange={handleInputChange}
              placeholder="Age"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              name="height"
              value={healthProfile.height}
              onChange={handleInputChange}
              placeholder="Height (cm)"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              name="weight"
              value={healthProfile.weight}
              onChange={handleInputChange}
              placeholder="Weight (kg)"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="medicalConditions"
              value={healthProfile.medicalConditions}
              onChange={handleInputChange}
              placeholder="Medical Conditions (comma-separated)"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="allergies"
              value={healthProfile.allergies}
              onChange={handleInputChange}
              placeholder="Allergies (comma-separated)"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="medications"
              value={healthProfile.medications}
              onChange={handleInputChange}
              placeholder="Current Medications (comma-separated)"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="dietaryRestrictions"
              value={healthProfile.dietaryRestrictions}
              onChange={handleInputChange}
              placeholder="Dietary Restrictions (comma-separated)"
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col max-h-screen">
        <ChatHeader />
        <CategorySelector selectedCategory={category} onSelect={setCategory} />
        
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12">
                <p>Start a conversation about {category} health topics.</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  onReact={handleReaction}
                />
              ))
            )}
            {isLoading && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="animate-pulse flex gap-4 p-6">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ChatInput onSend={sendMessage} disabled={isLoading} />
        <button
          onClick={handleEndChat}
          className="w-full bg-red-500 text-white py-2 mt-2 rounded hover:bg-red-600"
        >
          End Chat
        </button>
      </div>
    </div>
  );
}

export default App;
