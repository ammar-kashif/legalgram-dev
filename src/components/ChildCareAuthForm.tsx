import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Calendar as CalendarIcon, Plus, Trash2, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CountryStateAPI from 'countries-states-cities';
import UserInfoStep from "@/components/UserInfoStep";

// Define section structure
interface Section {
  id: string;
  title: string;
  description?: string;
  questions: string[];
  nextSectionId?: string;
}

// Define the question type interface
interface Question {
  id: string;
  type: 'text' | 'select' | 'radio' | 'textarea' | 'confirmation' | 'date' | 'number' | 'email' | 'phone' | 'children' | 'parent' | 'caretaker' | 'emergency';
  text: string;
  options?: string[];
  nextQuestionId?: Record<string, string>;
  defaultNextId?: string;
}

// Child interface
interface Child {
  fullName: string;
  dateOfBirth: string;
}

// Parent interface  
interface Parent {
  name: string;
}

// Caretaker interface
interface Caretaker {
  name: string;
}

// Emergency contact interface
interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
}

// Define interfaces for the countries-states-cities data structure
interface CountryData {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  capital: string;
  currency: string;
  native: string;
  region: string;
  subregion: string;
  emoji: string;
}

interface StateData {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  state_code: string;
}

// Country to states/provinces mapping using comprehensive database with proper ID relationships
const getAllCountries = (): CountryData[] => {
  return CountryStateAPI.getAllCountries();
};

const getStatesByCountry = (countryId: number): StateData[] => {
  return CountryStateAPI.getStatesOfCountry(countryId);
};

// Helper functions to get display names from IDs
const getCountryName = (countryId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  return country?.name || `Country ID: ${countryId}`;
};

const getStateName = (countryId: string, stateId: string): string => {
  const country = CountryStateAPI.getAllCountries().find(c => c.id.toString() === countryId);
  if (!country) return `State ID: ${stateId}`;
  
  const states = CountryStateAPI.getStatesOfCountry(country.id);
  const state = states.find(s => s.id.toString() === stateId);
  return state?.name || `State ID: ${stateId}`;
};

// Sections definition - grouping questions by category
const sections: Record<string, Section> = {
  'location_selection': {
    id: 'location_selection',
    title: 'Location Selection',
    description: 'Select the country and state/province where this authorization will be executed',
    questions: ['country', 'state'],
    nextSectionId: 'parties'
  },
  'parties': {
    id: 'parties',
    title: 'Parties Information',
    description: 'Enter information about the parents/guardians',
    questions: ['parent_names', 'parent_address', 'parent_phones', 'parent_emails'],
    nextSectionId: 'caretakers'
  },
  'caretakers': {
    id: 'caretakers',
    title: 'Caretaker Information',
    description: 'Enter information about the caretakers',
    questions: ['caretaker_names', 'caretaker_address', 'caretaker_phones', 'caretaker_relationship'],
    nextSectionId: 'children'
  },
  'children': {
    id: 'children',
    title: 'Subject Children',
    description: 'Enter information about the children',
    questions: ['children_info'],
    nextSectionId: 'duration'
  },
  'duration': {
    id: 'duration',
    title: 'Duration of Authorization',
    description: 'Specify the time period for this authorization',
    questions: ['start_date', 'end_date'],
    nextSectionId: 'emergency'
  },
  'emergency': {
    id: 'emergency',
    title: 'Emergency Contact Information',
    description: 'Provide emergency contact details',
    questions: ['primary_emergency', 'secondary_emergency'],
    nextSectionId: 'governing'
  },
  'governing': {
    id: 'governing',
    title: 'Governing Law',
    description: 'Specify the governing state',
    questions: ['governing_state'],
    nextSectionId: 'notary'
  },
  'notary': {
    id: 'notary',
    title: 'Notary Information (Optional)',
    description: 'Notary acknowledgment details if required',
    questions: ['notary_state', 'notary_county'],
    nextSectionId: 'user_info_step'
  },
  'user_info_step': {
    id: 'user_info_step',
    title: 'Contact Information',
    description: 'Provide your contact information to generate the document',
    questions: ['user_info_step'],
    nextSectionId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and confirm your information',
    questions: ['confirmation']
  }
};

// Define the question flow
const questions: Record<string, Question> = {
  'country': {
    id: 'country',
    type: 'select',
    text: 'Select the country where this authorization will be executed:',
    options: [], // Will be populated dynamically from the database
    defaultNextId: 'state'
  },
  'state': {
    id: 'state',
    type: 'select',
    text: 'Select the state/province where this authorization will be executed:',
    options: [], // Will be populated dynamically based on country selection
    defaultNextId: 'parent_names'
  },
  'parent_names': {
    id: 'parent_names',
    type: 'parent',
    text: 'Parent(s)/Guardian(s) Names:',
    defaultNextId: 'parent_address'
  },
  'parent_address': {
    id: 'parent_address',
    type: 'textarea',
    text: 'Parent(s)/Guardian(s) Address:',
    defaultNextId: 'parent_phones'
  },
  'parent_phones': {
    id: 'parent_phones',
    type: 'text',
    text: 'Parent(s)/Guardian(s) Phone Number(s):',
    defaultNextId: 'parent_emails'
  },
  'parent_emails': {
    id: 'parent_emails',
    type: 'text',
    text: 'Parent(s)/Guardian(s) Email(s):',
    defaultNextId: 'caretaker_names'
  },
  'caretaker_names': {
    id: 'caretaker_names',
    type: 'caretaker',
    text: 'Caretaker(s) Names:',
    defaultNextId: 'caretaker_address'
  },
  'caretaker_address': {
    id: 'caretaker_address',
    type: 'textarea',
    text: 'Caretaker(s) Address:',
    defaultNextId: 'caretaker_phones'
  },
  'caretaker_phones': {
    id: 'caretaker_phones',
    type: 'text',
    text: 'Caretaker(s) Phone Number(s):',
    defaultNextId: 'caretaker_relationship'
  },
  'caretaker_relationship': {
    id: 'caretaker_relationship',
    type: 'text',
    text: 'Relationship to Child(ren):',
    defaultNextId: 'children_info'
  },
  'children_info': {
    id: 'children_info',
    type: 'children',
    text: 'Children Information:',
    defaultNextId: 'start_date'
  },
  'start_date': {
    id: 'start_date',
    type: 'date',
    text: 'Authorization Start Date:',
    defaultNextId: 'end_date'
  },
  'end_date': {
    id: 'end_date',
    type: 'date',
    text: 'Authorization End Date:',
    defaultNextId: 'primary_emergency'
  },
  'primary_emergency': {
    id: 'primary_emergency',
    type: 'emergency',
    text: 'Primary Emergency Contact:',
    defaultNextId: 'secondary_emergency'
  },
  'secondary_emergency': {
    id: 'secondary_emergency',
    type: 'emergency',
    text: 'Secondary Emergency Contact:',
    defaultNextId: 'governing_state'
  },
  'governing_state': {
    id: 'governing_state',
    type: 'select',
    text: 'Governing State/Province:',
    options: [], // Will be populated dynamically based on selected country
    defaultNextId: 'notary_state'
  },  'notary_state': {
    id: 'notary_state',
    type: 'select',
    text: 'Notary State/Province (Optional):',
    options: [], // Will be populated dynamically based on selected country
    defaultNextId: 'notary_county'
  },
  'notary_county': {
    id: 'notary_county',
    type: 'text',
    text: 'Notary County (Optional):',
    defaultNextId: 'user_info_step'
  },
  'user_info_step': {
    id: 'user_info_step',
    type: 'text',
    text: 'Please provide your contact information to generate the document.',
    defaultNextId: 'confirmation'
  },
  'confirmation': {
    id: 'confirmation',
    type: 'confirmation',
    text: 'Thank you for providing the information. We will generate your Child Care Authorization Agreement based on your answers.',
  }
};

const ChildCareAuthForm = () => {  const [currentSectionId, setCurrentSectionId] = useState<string>('location_selection');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sectionHistory, setSectionHistory] = useState<string[]>(['location_selection']);
  const [isComplete, setIsComplete] = useState(false);
  const [children, setChildren] = useState<Child[]>([{ fullName: '', dateOfBirth: '' }]);
  const [parents, setParents] = useState<Parent[]>([{ name: '' }]);
  const [caretakers, setCaretakers] = useState<Caretaker[]>([{ name: '' }]);
  const [primaryEmergency, setPrimaryEmergency] = useState<EmergencyContact>({ name: '', phone: '', email: '' });
  const [secondaryEmergency, setSecondaryEmergency] = useState<EmergencyContact>({ name: '', phone: '', email: '' });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const currentSection = sections[currentSectionId];
    const handleNext = () => {
    try {
      const nextSectionId = currentSection?.nextSectionId;
      
      if (!nextSectionId) {
        setIsComplete(true);
        return;
      }
      
      // Validate that the next section exists
      if (sections[nextSectionId]) {
        setSectionHistory([...sectionHistory, nextSectionId]);
        setCurrentSectionId(nextSectionId);
      } else {
        console.error(`Next section ${nextSectionId} does not exist`);
        toast.error("Navigation error. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = [...sectionHistory];
      newHistory.pop();
      setSectionHistory(newHistory);
      setCurrentSectionId(newHistory[newHistory.length - 1]);
    }
  };
  
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const addChild = () => {
    setChildren([...children, { fullName: '', dateOfBirth: '' }]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);
  };

  const addParent = () => {
    setParents([...parents, { name: '' }]);
  };

  const removeParent = (index: number) => {
    if (parents.length > 1) {
      setParents(parents.filter((_, i) => i !== index));
    }
  };

  const updateParent = (index: number, value: string) => {
    const updatedParents = [...parents];
    updatedParents[index].name = value;
    setParents(updatedParents);
  };

  const addCaretaker = () => {
    setCaretakers([...caretakers, { name: '' }]);
  };

  const removeCaretaker = (index: number) => {
    if (caretakers.length > 1) {
      setCaretakers(caretakers.filter((_, i) => i !== index));
    }
  };

  const updateCaretaker = (index: number, value: string) => {
    const updatedCaretakers = [...caretakers];
    updatedCaretakers[index].name = value;
    setCaretakers(updatedCaretakers);
  };

  const updateEmergencyContact = (type: 'primary' | 'secondary', field: keyof EmergencyContact, value: string) => {
    if (type === 'primary') {
      setPrimaryEmergency({ ...primaryEmergency, [field]: value });
    } else {
      setSecondaryEmergency({ ...secondaryEmergency, [field]: value });
    }
  };
  
  const renderQuestionInput = (questionId: string) => {
    const question = questions[questionId];
    
    switch (question.type) {
      case 'text':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Type your answer"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'number':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="number"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter a number"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'email':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="email"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter email address"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'phone':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Input
              id={questionId}
              type="tel"
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Enter phone number"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
            />
          </div>
        );
      case 'date':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !answers[questionId] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {answers[questionId] ? answers[questionId] : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white rounded-lg shadow-sm">
                <Calendar
                  mode="single"
                  selected={answers[questionId] ? new Date(answers[questionId]) : undefined}
                  onSelect={(date) => handleAnswer(questionId, date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                  className="p-3 pointer-events-auto bg-white rounded-lg shadow-sm"
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'select':
        // Get options based on question type
        let optionsToShow: Array<{value: string, label: string}> = [];
        
        if (questionId === 'country') {
          // Get all countries from the database using the new API
          const countries = getAllCountries();
          optionsToShow = countries.map(country => ({
            value: country.id.toString(),
            label: country.name
          }));
        } else if (questionId === 'state' && answers.country) {
          // Get states for the selected country using country ID
          const countryId = parseInt(answers.country);
          const states = getStatesByCountry(countryId);
          optionsToShow = states.map(state => ({
            value: state.id.toString(),
            label: state.name
          }));
        } else if (questionId === 'governing_state' && answers.country) {
          // Get states for the selected country using country ID
          const countryId = parseInt(answers.country);
          const states = getStatesByCountry(countryId);
          optionsToShow = states.map(state => ({
            value: state.id.toString(),
            label: state.name
          }));
        } else if (questionId === 'notary_state' && answers.country) {
          // Get states for the selected country using country ID
          const countryId = parseInt(answers.country);
          const states = getStatesByCountry(countryId);
          optionsToShow = [
            { value: 'None', label: 'None' },
            ...states.map(state => ({
              value: state.id.toString(),
              label: state.name
            }))
          ];
        } else if (question.options) {
          // Use static options for other select questions
          optionsToShow = question.options.map(option => ({
            value: option,
            label: option
          }));
        }
        
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Select 
              value={answers[questionId] || ''} 
              onValueChange={(value) => {
                handleAnswer(questionId, value);
                // Clear dependent selections when country changes
                if (questionId === 'country') {
                  if (answers.state) handleAnswer('state', '');
                  if (answers.governing_state) handleAnswer('governing_state', '');
                  if (answers.notary_state) handleAnswer('notary_state', '');
                }
              }}
              disabled={(questionId === 'state' || questionId === 'governing_state' || questionId === 'notary_state') && !answers.country}
            >
              <SelectTrigger className="mt-1 text-black w-full bg-white rounded-lg shadow-sm">
                <SelectValue placeholder={
                  (questionId === 'state' || questionId === 'governing_state' || questionId === 'notary_state') && !answers.country 
                    ? "Please select a country first" 
                    : "Select an option"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg shadow-sm">
                {optionsToShow.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'radio':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <RadioGroup
              value={answers[questionId] || ''}
              onValueChange={(value) => handleAnswer(questionId, value)}
              className="mt-2 space-y-2 text-black"
            >
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${questionId}-${option}`} />
                  <Label htmlFor={`${questionId}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'textarea':
        return (
          <div className="mb-4">
            <Label htmlFor={questionId} className="block text-sm font-medium text-black mb-1">
              {question.text}
            </Label>
            <Textarea
              id={questionId}
              value={answers[questionId] || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Type your answer"
              className="mt-1 text-black w-full bg-white rounded-lg shadow-sm"
              rows={3}
            />
          </div>
        );
      case 'parent':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="space-y-2">
              {parents.map((parent, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={parent.name}
                    onChange={(e) => updateParent(index, e.target.value)}
                    placeholder={`Parent/Guardian ${index + 1} name`}
                    className="flex-1 text-black"
                  />
                  {parents.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeParent(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParent}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Parent/Guardian
              </Button>
            </div>
          </div>
        );
      case 'caretaker':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="space-y-2">
              {caretakers.map((caretaker, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={caretaker.name}
                    onChange={(e) => updateCaretaker(index, e.target.value)}
                    placeholder={`Caretaker ${index + 1} name`}
                    className="flex-1 text-black"
                  />
                  {caretakers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCaretaker(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCaretaker}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Caretaker
              </Button>
            </div>
          </div>
        );
      case 'children':
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="space-y-4">
              {children.map((child, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Child {index + 1}</h4>
                    {children.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeChild(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm">Full Name</Label>
                      <Input
                        value={child.fullName}
                        onChange={(e) => updateChild(index, 'fullName', e.target.value)}
                        placeholder="Enter full name"
                        className="text-black"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !child.dateOfBirth && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {child.dateOfBirth ? child.dateOfBirth : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white rounded-lg shadow-sm">
                          <Calendar
                            mode="single"
                            selected={child.dateOfBirth ? new Date(child.dateOfBirth) : undefined}
                            onSelect={(date) => updateChild(index, 'dateOfBirth', date ? format(date, 'yyyy-MM-dd') : '')}
                            initialFocus
                            className="p-3 pointer-events-auto bg-white rounded-lg shadow-sm"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChild}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Child
              </Button>
            </div>
          </div>
        );
      case 'emergency':
        const isSecondary = questionId === 'secondary_emergency';
        const contact = isSecondary ? secondaryEmergency : primaryEmergency;
        return (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-black mb-2">
              {question.text}
            </Label>
            <div className="border rounded-lg p-4 space-y-2">
              <div>
                <Label className="text-sm">Name</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(isSecondary ? 'secondary' : 'primary', 'name', e.target.value)}
                  placeholder="Enter contact name"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Phone</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) => updateEmergencyContact(isSecondary ? 'secondary' : 'primary', 'phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="text-black"
                />
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <Input
                  value={contact.email}
                  onChange={(e) => updateEmergencyContact(isSecondary ? 'secondary' : 'primary', 'email', e.target.value)}
                  placeholder="Enter email address"
                  className="text-black"
                />
              </div>
            </div>
          </div>
        );
      case 'confirmation':
        return (
          <div className="mt-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-4 text-black">
              {question.text}
            </p>
          </div>
        );
      default:
        return null;
    }
  };
    const renderSectionQuestions = () => {
    console.log("Current section:", currentSectionId, "Questions:", currentSection?.questions);
    return currentSection.questions.map(questionId => renderQuestionInput(questionId));
  };    const canAdvance = () => {
    if (currentSectionId === 'confirmation') return true;
    
    // Special validation for location selection
    if (currentSectionId === 'location_selection') {
      return answers.country && answers.state;
    }
    // Special validation for dynamic sections
    if (currentSectionId === 'parties') {
      return parents.some(p => p.name.trim()) && answers.parent_address && answers.parent_phones && answers.parent_emails;
    }
    if (currentSectionId === 'caretakers') {
      return caretakers.some(c => c.name.trim()) && answers.caretaker_address && answers.caretaker_phones && answers.caretaker_relationship;
    }
    if (currentSectionId === 'children') {
      return children.some(c => c.fullName.trim() && c.dateOfBirth);
    }
    if (currentSectionId === 'duration') {
      return answers.start_date && answers.end_date;
    }
    if (currentSectionId === 'emergency') {
      return primaryEmergency.name && primaryEmergency.phone;
    }
    if (currentSectionId === 'governing') {
      return answers.governing_state;
    }
    if (currentSectionId === 'notary') {
      // Notary section is optional, so always allow advance
      return true;
    }
    if (currentSectionId === 'user_info_step') {
      return answers.user_info_step;
    }
    
    // Check if all required fields in the current section have answers
    const requiredQuestions = currentSection.questions.filter(q => !q.includes('notary') && !q.includes('user_info_step')); // Notary and user_info_step fields are optional
    return requiredQuestions.every(questionId => !!answers[questionId]);
  };
  const generateChildCareAuthPDF = () => {
    setIsGeneratingPDF(true);
    try {
      console.log("Generating Child Care Authorization Agreement PDF...");
      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Child Care Authorization Agreement", 105, 20, { align: "center" });
      
      // Reset to normal font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      let y = 35;
      const lineHeight = 6;
      const pageHeight = 280;
      
      // Introduction paragraph (similar to lease agreement style)
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const parentNames = parents.map(p => p.name).filter(name => name.trim()).join(" and ");
      const caretakerNames = caretakers.map(c => c.name).filter(name => name.trim()).join(" and ");
      
      const introText = `This Child Care Authorization Agreement ("Agreement") is entered into on ${currentDate}, by and between ${parentNames || '_______________'} ("Parent(s)/Guardian(s)"), and ${caretakerNames || '_______________'} ("Caretaker(s)").`;
      
      const introLines = doc.splitTextToSize(introText, 170);
      introLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Parent Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Parent(s)/Guardian(s) Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const parentInfoText = `The Parent(s)/Guardian(s) hereby authorize(s) the care of the child(ren) listed below. Parent(s)/Guardian(s) contact information: Address: ${answers.parent_address || '_______________________________________________'}, Phone: ${answers.parent_phones || '_______________'}, Email: ${answers.parent_emails || '_______________________________________________'}.`;
      
      const parentInfoLines = doc.splitTextToSize(parentInfoText, 170);
      parentInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Caretaker Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Caretaker(s) Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const caretakerInfoText = `The Caretaker(s) agree(s) to provide care for the child(ren) as specified in this Agreement. Caretaker(s) contact information: Address: ${answers.caretaker_address || '_______________________________________________'}, Phone: ${answers.caretaker_phones || '_______________'}, Relationship to Child(ren): ${answers.caretaker_relationship || '_______________'}.`;
      
      const caretakerInfoLines = doc.splitTextToSize(caretakerInfoText, 170);
      caretakerInfoLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Subject Children Section
      doc.setFont("helvetica", "bold");
      doc.text("Subject Child(ren).", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      let childrenText = "This Agreement applies to the following child(ren): ";
      const validChildren = children.filter(c => c.fullName.trim() || c.dateOfBirth);
      
      if (validChildren.length > 0) {
        const childrenInfo = validChildren.map(child => 
          `${child.fullName || '_______________'} (DOB: ${child.dateOfBirth || '_______________'})`
        ).join(", ");
        childrenText += childrenInfo + ".";
      } else {
        childrenText += "Name: _______________, Date of Birth: _______________.";
      }
      
      const childrenLines = doc.splitTextToSize(childrenText, 170);
      childrenLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Duration Section
      doc.setFont("helvetica", "bold");
      doc.text("Duration of Authorization.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const durationText = `This authorization shall be effective from ${answers.start_date || '____ day of ___________, 20__'} ("Start Date") and shall remain in effect until ${answers.end_date || '____ day of ___________, 20__'} ("End Date"), unless terminated earlier in accordance with the terms of this Agreement.`;
      
      const durationLines = doc.splitTextToSize(durationText, 170);
      durationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Check if we need a new page
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      
      // Emergency Contact Information
      doc.setFont("helvetica", "bold");
      doc.text("Emergency Contact Information.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      let emergencyText = "In case of emergency, the following contacts should be notified: ";
      emergencyText += `Primary Contact: ${primaryEmergency.name || '_______________'} (Phone: ${primaryEmergency.phone || '_______________'}`;
      if (primaryEmergency.email) {
        emergencyText += `, Email: ${primaryEmergency.email}`;
      }
      emergencyText += "). ";
      
      if (secondaryEmergency.name || secondaryEmergency.phone) {
        emergencyText += `Secondary Contact: ${secondaryEmergency.name || '_______________'} (Phone: ${secondaryEmergency.phone || '_______________'}`;
        if (secondaryEmergency.email) {
          emergencyText += `, Email: ${secondaryEmergency.email}`;
        }
        emergencyText += ").";
      } else {
        emergencyText += "Secondary Contact: _______________ (Phone: _______________).";
      }
      
      const emergencyLines = doc.splitTextToSize(emergencyText, 170);
      emergencyLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Authorization Powers
      doc.setFont("helvetica", "bold");
      doc.text("Authorization Powers.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const authorizationText = "The Parent(s)/Guardian(s) hereby authorize(s) the Caretaker(s) to make decisions regarding the daily care, supervision, and welfare of the child(ren), including but not limited to medical care in case of emergency, educational decisions, and general supervision. This authorization does not extend to major medical procedures or decisions that require parental consent under state law.";
      
      const authorizationLines = doc.splitTextToSize(authorizationText, 170);
      authorizationLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight;
      
      // Governing Law
      doc.setFont("helvetica", "bold");
      doc.text("Governing Law.", 15, y);
      y += lineHeight;
      
      doc.setFont("helvetica", "normal");
      const governingStateName = answers.governing_state && answers.country 
        ? getStateName(answers.country, answers.governing_state) 
        : '_______________';
      const governingText = `This Agreement shall be governed by and construed in accordance with the laws of the State/Province of ${governingStateName}.`;
      
      const governingLines = doc.splitTextToSize(governingText, 170);
      governingLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += lineHeight;
      });
      y += lineHeight + 10;
      
      // Check if we need a new page for signatures
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 20;
      }
      
      // Signatures Section
      doc.setFont("helvetica", "bold");
      doc.text("Signatures.", 15, y);
      y += lineHeight + 5;
      
      doc.setFont("helvetica", "normal");
      
      // Parent signatures
      doc.text("The Parent(s)/Guardian(s):", 15, y);
      y += lineHeight + 5;
      
      parents.forEach((parent, index) => {
        doc.text("____________________________", 15, y);
        y += lineHeight;
        doc.text(`${parent.name || '_______________'} (Printed Name)`, 15, y);
        y += lineHeight + 5;
      });
      
      y += 5;
      
      // Caretaker signatures
      doc.text("The Caretaker(s):", 15, y);
      y += lineHeight + 5;
      
      caretakers.forEach((caretaker, index) => {
        doc.text("____________________________", 15, y);
        y += lineHeight;
        doc.text(`${caretaker.name || '_______________'} (Printed Name)`, 15, y);
        y += lineHeight + 5;
      });
      
      y += 5;
      doc.text("Date: _________________", 15, y);
      
      // Check if we need notary section
      if (answers.notary_state && answers.notary_state !== 'None' || answers.notary_county) {
        // Check if we need a new page for notary
        if (y > pageHeight - 60) {
          doc.addPage();
          y = 20;
        } else {
          y += 20;
        }
        
        doc.setFont("helvetica", "bold");
        doc.text("Notary Acknowledgment.", 15, y);
        y += lineHeight + 2;
        
        doc.setFont("helvetica", "normal");
        const notaryStateName = (answers.notary_state && answers.notary_state !== 'None' && answers.country) 
          ? getStateName(answers.country, answers.notary_state) 
          : '_____________________';
        doc.text(`State/Province of ${notaryStateName}`, 15, y);
        y += lineHeight;
        
        doc.text(`County of ${answers.notary_county || '___________________'}`, 15, y);
        y += lineHeight + 3;
        
        const appearingPersons = [...parents.map(p => p.name), ...caretakers.map(c => c.name)]
          .filter(name => name.trim())
          .join(" and ");
        
        const notaryText = `On this ____ day of __________, 20__, before me personally appeared ${appearingPersons || '_______________________________________________'}, who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity, and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.`;
        
        const notaryLines = doc.splitTextToSize(notaryText, 170);
        notaryLines.forEach((line: string) => {
          doc.text(line, 15, y);
          y += lineHeight;
        });
        
        y += lineHeight;
        doc.text("______________________________", 15, y);
        y += lineHeight;
        doc.text("Notary Public Signature", 15, y);
        y += lineHeight + 3;
        doc.text("My commission expires: _______________", 15, y);
      }
      
      // Save the PDF
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `child_care_authorization_${timestamp}.pdf`;
      console.log("Saving PDF with filename:", filename);
      
      doc.save(filename);
      
      toast.success("Child Care Authorization Agreement successfully generated!");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate Child Care Authorization Agreement");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  const renderFormSummary = () => {
    return (
      <div className="space-y-4 text-black">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Child Care Authorization Agreement Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">General Information</h4>
              <p><strong>Country:</strong> {answers.country ? getCountryName(answers.country) : 'Not provided'}</p>
              <p><strong>State/Province:</strong> {answers.state && answers.country ? getStateName(answers.country, answers.state) : 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Parents/Guardians</h4>
              <p><strong>Names:</strong> {parents.map(p => p.name).filter(n => n.trim()).join(", ") || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.parent_address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {answers.parent_phones || 'Not provided'}</p>
              <p><strong>Email:</strong> {answers.parent_emails || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Caretakers</h4>
              <p><strong>Names:</strong> {caretakers.map(c => c.name).filter(n => n.trim()).join(", ") || 'Not provided'}</p>
              <p><strong>Address:</strong> {answers.caretaker_address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {answers.caretaker_phones || 'Not provided'}</p>
              <p><strong>Relationship:</strong> {answers.caretaker_relationship || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Children</h4>
              {children.filter(c => c.fullName.trim() || c.dateOfBirth).map((child, index) => (
                <div key={index}>
                  <p><strong>Name:</strong> {child.fullName || 'Not provided'}</p>
                  <p><strong>DOB:</strong> {child.dateOfBirth || 'Not provided'}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Duration</h4>
              <p><strong>Start:</strong> {answers.start_date || 'Not provided'}</p>
              <p><strong>End:</strong> {answers.end_date || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Emergency Contacts</h4>
              <p><strong>Primary:</strong> {primaryEmergency.name || 'Not provided'} - {primaryEmergency.phone || 'Not provided'}</p>
              <p><strong>Secondary:</strong> {secondaryEmergency.name || 'Not provided'} - {secondaryEmergency.phone || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Governing Law</h4>
              <p><strong>Governing State/Province:</strong> {answers.governing_state && answers.country ? getStateName(answers.country, answers.governing_state) : 'Not provided'}</p>
              {answers.notary_state && answers.notary_state !== 'None' && (
                <p><strong>Notary State/Province:</strong> {answers.notary_state && answers.country ? getStateName(answers.country, answers.notary_state) : 'Not provided'}</p>
              )}
              {answers.notary_county && <p><strong>Notary County:</strong> {answers.notary_county}</p>}
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-center mb-2">
            By generating this document, you confirm the accuracy of the information provided. 
            This document will serve as your official Child Care Authorization Agreement.
          </p>
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600">Child Care Authorization Agreement</CardTitle>
          <CardDescription>
            Review your agreement details below before generating the final document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderFormSummary()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => {
              setAnswers({});
              setSectionHistory(['location_selection']);
              setCurrentSectionId('location_selection');
              setIsComplete(false);
              setChildren([{ fullName: '', dateOfBirth: '' }]);
              setParents([{ name: '' }]);
              setCaretakers([{ name: '' }]);
              setPrimaryEmergency({ name: '', phone: '', email: '' });
              setSecondaryEmergency({ name: '', phone: '', email: '' });
            }}
          >
            Start Over
          </Button>
          <Button 
            onClick={generateChildCareAuthPDF}
          >
            Generate Agreement
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  }

  // Safety check for currentSection
  if (!currentSection) {
    return (
      <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
        <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <CardContent className="text-center p-4">
          <p className="text-red-500">An error occurred. Please refresh the page.</p>
          <Button 
            onClick={() => {              setCurrentSectionId('location_selection');
              setSectionHistory(['location_selection']);
            }}
            className="mt-4"
          >
            Start Over
          </Button>
        </CardContent>
      </Card>
    </div>
  );
  }

  // In the render logic, render UserInfoStep for user_info_step section
  if (currentSectionId === 'user_info_step') {
    return (
      <UserInfoStep
        onBack={handleBack}
        onGenerate={generateChildCareAuthPDF}
        documentType="Child Care Authorization"
        isGenerating={isGeneratingPDF}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-0 bg-white rounded-lg shadow-sm p-4">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{currentSection.title}</CardTitle>
        <CardDescription>
          {currentSection.description}
          <div className="mt-2 text-sm">
            Step {sectionHistory.length} of {Object.keys(sections).length}
          </div>
        </CardDescription>
        {currentSectionId === 'location_selection' && (
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={() => window.open('/child-care-authorization-info', '_blank')}
              className="text-bright-orange-600 border-bright-orange-600 hover:bg-bright-orange-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Learn More About Child Care Authorization
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="text-black">
        <div className="grid grid-cols-1 gap-y-2">
          {renderSectionQuestions()}
        </div>
      </CardContent>
      {currentSectionId !== 'user_info_step' && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={sectionHistory.length <= 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={() => handleNext()}
            disabled={!canAdvance()}
          >
            {currentSectionId === 'confirmation' ? (
              <>
                Complete <Send className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  </div>
  );
}

export default ChildCareAuthForm;







