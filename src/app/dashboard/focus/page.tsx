'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  X, 
  Plus, 
  Minus,
  Volume2,
  VolumeX,
  CheckCircle2,
  Moon,
  Sun,
  Music,
  MessageSquare,
  Award,
  Sparkles,
  Brain,
  Zap,
  Flame,
  Upload,
  Repeat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getFocusSettings, 
  updateFocusSettings, 
  getFocusStreak, 
  createFocusSession,
  updateAudioSettings
} from '@/services/focusService';
import { FocusSettings, FocusStreak } from '@/lib/supabase';
import { useToastContext } from '@/components/ui/toast-provider';
import { supabase } from '@/lib/supabase';

// Add a function to check if Supabase tables exist
async function checkSupabaseTables() {
  try {
    console.log('Checking Supabase tables...');
    
    // First, check if we can connect to Supabase at all
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      console.error('Auth error details:', {
        code: authError.code,
        message: authError.message,
        status: authError.status
      });
      return {
        allTablesExist: false,
        missingTables: ['Authentication failed'],
        connectionError: true,
        errorDetails: authError
      };
    }
    
    console.log('Authentication successful:', !!authData.user, 'User ID:', authData.user?.id);
    
    // Try a direct approach first - check each table individually
    console.log('Checking tables directly...');
    
    try {
      const { data: focusSettingsExists, error: settingsError } = await supabase
        .from('focus_settings')
        .select('id')
        .limit(1);
        
      const { data: focusSessionsExists, error: sessionsError } = await supabase
        .from('focus_sessions')
        .select('id')
        .limit(1);
        
      const { data: focusStreaksExists, error: streaksError } = await supabase
        .from('focus_streaks')
        .select('id')
        .limit(1);
        
      console.log('Direct table query results:', {
        focusSettingsExists: !!focusSettingsExists,
        focusSessionsExists: !!focusSessionsExists,
        focusStreaksExists: !!focusStreaksExists,
        settingsError: settingsError ? {
          code: settingsError.code,
          message: settingsError.message,
          details: settingsError.details
        } : null,
        sessionsError: sessionsError ? {
          code: sessionsError.code,
          message: sessionsError.message,
          details: sessionsError.details
        } : null,
        streaksError: streaksError ? {
          code: streaksError.code,
          message: streaksError.message,
          details: streaksError.details
        } : null
      });
      
      // Check for table existence errors
      const missingTables = [];
      
      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error checking focus_settings:', settingsError);
        missingTables.push('focus_settings');
      }
      
      if (sessionsError && sessionsError.code !== 'PGRST116') {
        console.error('Error checking focus_sessions:', sessionsError);
        missingTables.push('focus_sessions');
      }
      
      if (streaksError && streaksError.code !== 'PGRST116') {
        console.error('Error checking focus_streaks:', streaksError);
        missingTables.push('focus_streaks');
      }
      
      return {
        allTablesExist: missingTables.length === 0,
        missingTables: missingTables.length > 0 ? missingTables : [],
        connectionError: false
      };
    } catch (directCheckError) {
      console.error('Error during direct table checks:', directCheckError);
      console.error('Direct check error details:', directCheckError instanceof Error ? {
        name: directCheckError.name,
        message: directCheckError.message,
        stack: directCheckError.stack
      } : JSON.stringify(directCheckError));
      
      // Fall back to information_schema if direct checks fail
      try {
        console.log('Falling back to information_schema...');
        const { data: tablesData, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .in('table_name', ['focus_settings', 'focus_sessions', 'focus_streaks']);
          
        if (tablesError) {
          console.error('Error checking tables via information_schema:', tablesError);
          console.error('Information schema error details:', {
            code: tablesError.code,
            message: tablesError.message,
            details: tablesError.details
          });
          
          // Try one more approach - check if we can at least query the database
          try {
            console.log('Attempting basic database query...');
            const { error: basicQueryError } = await supabase.rpc('get_server_version');
            
            if (basicQueryError) {
              console.error('Basic database query failed:', basicQueryError);
              return {
                allTablesExist: false,
                missingTables: ['Database connection failed completely'],
                connectionError: true,
                errorDetails: basicQueryError
              };
            }
          } catch (basicQueryError) {
            console.error('Exception during basic query:', basicQueryError);
          }
          
          return {
            allTablesExist: false,
            missingTables: ['Could not check tables due to permission error'],
            connectionError: true,
            errorDetails: tablesError
          };
        }
        
        console.log('Tables check result from information_schema:', tablesData);
        
        if (!tablesData || tablesData.length === 0) {
          return {
            allTablesExist: false,
            missingTables: ['focus_settings', 'focus_sessions', 'focus_streaks'],
            connectionError: false
          };
        }
        
        // Check which tables exist based on information_schema query
        const existingTables = tablesData.map(t => t.table_name);
        const requiredTables = ['focus_settings', 'focus_sessions', 'focus_streaks'];
        const missingTables = requiredTables.filter(t => !existingTables.includes(t));
        
        return {
          allTablesExist: missingTables.length === 0,
          missingTables: missingTables,
          connectionError: false
        };
      } catch (schemaError) {
        console.error('Error during information_schema check:', schemaError);
        console.error('Schema check error details:', schemaError instanceof Error ? {
          name: schemaError.name,
          message: schemaError.message,
          stack: schemaError.stack
        } : JSON.stringify(schemaError));
        
        return {
          allTablesExist: false,
          missingTables: ['Error checking tables via information_schema'],
          connectionError: true,
          errorDetails: schemaError instanceof Error ? schemaError.message : JSON.stringify(schemaError)
        };
      }
    }
  } catch (error) {
    console.error('Error checking tables:', error);
    console.error('Error type:', typeof error);
    console.error('Error details:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : JSON.stringify(error));
    
    return {
      allTablesExist: false,
      missingTables: ['Unexpected error checking tables'],
      connectionError: true,
      errorDetails: error instanceof Error ? error.message : JSON.stringify(error)
    };
  }
}

export default function FocusTimerPage() {
  const { toast } = useToastContext();
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Enhanced focus mode states
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'nature' | 'space'>('light');
  const [showAmbientSounds, setShowAmbientSounds] = useState(false);
  const [selectedAmbientSound, setSelectedAmbientSound] = useState<string | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState<string>('');
  const [focusStreak, setFocusStreak] = useState(0);
  const [showFocusTips, setShowFocusTips] = useState(false);
  const [currentFeelingLevel, setCurrentFeelingLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Timer settings
  const [settings, setSettings] = useState({
    focusTime: 25, // minutes
    shortBreakTime: 5, // minutes
    longBreakTime: 15, // minutes
    sessionsUntilLongBreak: 4,
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  
  // Audio states
  const [audioVolume, setAudioVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(true);
  const [customAudioFiles, setCustomAudioFiles] = useState<{id: string, name: string, file: File}[]>([]);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Demo mode state
  const [isDemoMode, setIsDemoMode] = useState(false);
  // Add a ref to track if we've already checked Supabase
  const hasCheckedSupabaseRef = useRef(false);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/bell.mp3'); // Timer completion sound
    ambientSoundRef.current = new Audio(); // Ambient sound player
    ambientSoundRef.current.loop = isLooping;
    ambientSoundRef.current.volume = audioVolume;
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
        ambientSoundRef.current.src = '';
      }
    };
  }, []);
  
  // Update audio loop setting when isLooping changes
  useEffect(() => {
    if (ambientSoundRef.current) {
      ambientSoundRef.current.loop = isLooping;
    }
  }, [isLooping]);
  
  // Update audio volume when audioVolume changes
  useEffect(() => {
    if (ambientSoundRef.current) {
      ambientSoundRef.current.volume = audioVolume;
    }
  }, [audioVolume]);
  
  // Check Supabase tables on component mount - only once
  useEffect(() => {
    async function verifySupabaseSetup() {
      // Skip if we've already checked
      if (hasCheckedSupabaseRef.current) return;
      
      hasCheckedSupabaseRef.current = true;
      
      try {
        const { allTablesExist, missingTables, connectionError } = await checkSupabaseTables();
        
        if (!allTablesExist) {
          if (connectionError) {
            toast({
              title: 'Database Connection Error',
              description: 'Running in demo mode. Your settings will not be saved.',
              variant: 'destructive'
            });
            setIsDemoMode(true);
          } else {
            toast({
              title: 'Database Setup Required',
              description: `Missing tables: ${missingTables.join(', ')}. Running in demo mode.`,
              variant: 'destructive'
            });
            setIsDemoMode(true);
          }
        }
      } catch (error) {
        console.error('Error verifying Supabase setup:', error);
        setIsDemoMode(true);
      }
    }
    
    verifySupabaseSetup();
  }, []); // Empty dependency array - only run once
  
  // Load user settings and streak from Supabase
  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true);
        
        if (isDemoMode) {
          // Use default settings in demo mode
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return;
        }
        
        // Load settings
        const userSettings = await getFocusSettings();
        if (userSettings) {
          setSettings({
            focusTime: userSettings.focus_time,
            shortBreakTime: userSettings.short_break_time,
            longBreakTime: userSettings.long_break_time,
            sessionsUntilLongBreak: userSettings.sessions_until_long_break
          });
          setSoundEnabled(userSettings.sound_enabled);
          setCurrentTheme(userSettings.preferred_theme);
          
          // Load audio settings
          if (userSettings.audio_volume !== undefined) {
            setAudioVolume(userSettings.audio_volume);
          }
          if (userSettings.audio_looping !== undefined) {
            setIsLooping(userSettings.audio_looping);
          }
          if (userSettings.last_ambient_sound) {
            setSelectedAmbientSound(userSettings.last_ambient_sound);
            
            // If there's a last ambient sound, try to play it
            if (ambientSoundRef.current && userSettings.sound_enabled) {
              const sound = ambientSounds.find(s => s.id === userSettings.last_ambient_sound);
              if (sound) {
                ambientSoundRef.current.src = sound.src;
                ambientSoundRef.current.play().catch(err => {
                  console.error('Error playing ambient sound:', err);
                });
              }
            }
          }
          
          // Set initial timer based on mode
          if (timerMode === 'focus') {
            setTimeLeft(userSettings.focus_time * 60);
          } else if (timerMode === 'shortBreak') {
            setTimeLeft(userSettings.short_break_time * 60);
          } else {
            setTimeLeft(userSettings.long_break_time * 60);
          }
        }
        
        // Load streak
        const userStreak = await getFocusStreak();
        if (userStreak) {
          setFocusStreak(userStreak.current_streak);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load your settings. Using defaults.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [isDemoMode]);
  
  // Handle timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);
  
  // Handle timer completion
  const handleTimerComplete = async () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play();
    }
    
    try {
      if (!isDemoMode) {
        // Record the completed session in Supabase
        await createFocusSession({
          duration: timerMode === 'focus' 
            ? settings.focusTime * 60 
            : timerMode === 'shortBreak' 
              ? settings.shortBreakTime * 60 
              : settings.longBreakTime * 60,
          mode: timerMode,
          completed: true,
          energy_level: currentFeelingLevel
        });
      } else {
        // In demo mode, just increment the focus streak locally
        if (timerMode === 'focus') {
          setFocusStreak(prev => prev + 1);
        }
    }
    
    if (timerMode === 'focus') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Determine if we should take a long break or short break
      if (newSessionsCompleted % settings.sessionsUntilLongBreak === 0) {
        setTimerMode('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
      } else {
        setTimerMode('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
      }
    } else {
      // Break is over, back to focus
      setTimerMode('focus');
      setTimeLeft(settings.focusTime * 60);
    }
    
    // Pause the timer after completion
    setIsRunning(false);
      
      if (!isDemoMode) {
        // Refresh streak data
        const userStreak = await getFocusStreak();
        if (userStreak) {
          setFocusStreak(userStreak.current_streak);
        }
      }
    } catch (error) {
      console.error('Error handling timer completion:', error);
      toast({
        title: 'Error saving session',
        description: 'Your session was completed but could not be saved.',
        variant: 'destructive'
      });
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    let totalTime;
    switch (timerMode) {
      case 'focus':
        totalTime = settings.focusTime * 60;
        break;
      case 'shortBreak':
        totalTime = settings.shortBreakTime * 60;
        break;
      case 'longBreak':
        totalTime = settings.longBreakTime * 60;
        break;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  // Handle timer controls
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    
    switch (timerMode) {
      case 'focus':
        setTimeLeft(settings.focusTime * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreakTime * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreakTime * 60);
        break;
    }
  };
  
  // Handle timer mode change
  const changeTimerMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setTimerMode(mode);
    setIsRunning(false);
    
    switch (mode) {
      case 'focus':
        setTimeLeft(settings.focusTime * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreakTime * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreakTime * 60);
        break;
    }
  };
  
  // Update settings
  const updateSetting = async (key: keyof typeof settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update current timer if the changed setting affects it
    if (key === 'focusTime' && timerMode === 'focus') {
      setTimeLeft(value * 60);
    } else if (key === 'shortBreakTime' && timerMode === 'shortBreak') {
      setTimeLeft(value * 60);
    } else if (key === 'longBreakTime' && timerMode === 'longBreak') {
      setTimeLeft(value * 60);
    }
  };
  
  // Save settings to Supabase
  const saveSettings = async () => {
    if (isDemoMode) {
      setShowSettings(false);
      toast({
        title: 'Demo Mode',
        description: 'Settings are not saved in demo mode.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await updateFocusSettings({
        focus_time: settings.focusTime,
        short_break_time: settings.shortBreakTime,
        long_break_time: settings.longBreakTime,
        sessions_until_long_break: settings.sessionsUntilLongBreak,
        sound_enabled: soundEnabled,
        preferred_theme: currentTheme
      });
      
      setShowSettings(false);
      toast({
        title: 'Settings saved',
        description: 'Your timer settings have been updated.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'Your settings could not be saved.',
        variant: 'destructive'
      });
    }
  };
  
  // Get background color based on timer mode
  const getBackgroundColor = () => {
    switch (timerMode) {
      case 'focus':
        return 'from-primary-500 to-primary-700';
      case 'shortBreak':
        return 'from-green-500 to-green-700';
      case 'longBreak':
        return 'from-blue-500 to-blue-700';
    }
  };
  
  // Get text for current mode
  const getModeText = () => {
    switch (timerMode) {
      case 'focus':
        return 'Focus Session';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  // Enhanced focus mode functions and data
  const ambientSounds = [
    { id: 'rain', name: 'Rainfall', icon: '🌧️', src: '/sounds/ambient/rain.mp3' },
    { id: 'forest', name: 'Forest', icon: '🌲', src: '/sounds/ambient/forest.mp3' },
    { id: 'cafe', name: 'Café', icon: '☕', src: '/sounds/ambient/cafe.mp3' },
    { id: 'waves', name: 'Ocean Waves', icon: '🌊', src: '/sounds/ambient/waves.mp3' },
    { id: 'whitenoise', name: 'White Noise', icon: '📻', src: '/sounds/ambient/whitenoise.mp3' },
  ];

  const motivationalQuotes = [
    "Small steps lead to big achievements.",
    "Your focus determines your reality.",
    "Progress over perfection.",
    "One task at a time. You've got this!",
    "The best way to predict the future is to create it.",
    "Your brain is powerful. Your focus is unstoppable.",
    "Neurodiversity is your superpower.",
    "Celebrate each completed session!",
    "Distractions are temporary, your goals are permanent.",
    "Your unique mind sees what others miss."
  ];

  const focusTips = [
    { title: "Body Doubling", description: "Work alongside someone else (virtually or in-person) to maintain focus." },
    { title: "Task Chunking", description: "Break large tasks into smaller, more manageable pieces." },
    { title: "Sensory Management", description: "Use noise-cancelling headphones or fidget tools to help manage sensory input." },
    { title: "Visual Timers", description: "The visual countdown helps maintain time awareness." },
    { title: "Reward System", description: "Give yourself small rewards after completing focus sessions." },
    { title: "Movement Breaks", description: "Incorporate physical movement during breaks to reset your brain." }
  ];

  const toggleAmbientSounds = () => {
    setShowAmbientSounds(!showAmbientSounds);
    if (showMotivation) setShowMotivation(false);
    if (showFocusTips) setShowFocusTips(false);
  };

  const toggleMotivation = () => {
    setShowMotivation(!showMotivation);
    if (showAmbientSounds) setShowAmbientSounds(false);
    if (showFocusTips) setShowFocusTips(false);
    
    // Set a random motivational quote
    if (!showMotivation) {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentMotivation(motivationalQuotes[randomIndex]);
    }
  };

  const toggleFocusTips = () => {
    setShowFocusTips(!showFocusTips);
    if (showAmbientSounds) setShowAmbientSounds(false);
    if (showMotivation) setShowMotivation(false);
  };

  const selectAmbientSound = (soundId: string) => {
    if (selectedAmbientSound === soundId) {
      setSelectedAmbientSound(null);
      // Stop playing sound
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
        ambientSoundRef.current.currentTime = 0;
      }
      setUploadedAudioUrl(null);
      
      if (!isDemoMode) {
        // Save to Supabase
        updateAudioSettings({ last_ambient_sound: undefined }).catch(err => {
          console.error('Error saving ambient sound setting:', err);
        });
      }
    } else {
      setSelectedAmbientSound(soundId);
      // Play sound
      if (ambientSoundRef.current) {
        try {
          const sound = ambientSounds.find(s => s.id === soundId);
          if (sound) {
            ambientSoundRef.current.src = sound.src;
            ambientSoundRef.current.play().catch(err => {
              console.error('Error playing ambient sound:', err);
              toast({
                title: 'Sound file not found',
                description: `The ${sound.name} sound file is missing. Please add it to public/sounds/ambient/${sound.id}.mp3`,
                variant: 'destructive'
              });
            });
          }
        } catch (err) {
          console.error('Error setting audio source:', err);
          toast({
            title: 'Sound file error',
            description: 'Could not load the selected sound file.',
            variant: 'destructive'
          });
        }
        
        // If it's a custom uploaded sound
        if (soundId.startsWith('custom-')) {
          const customSound = customAudioFiles.find(s => s.id === soundId);
          if (customSound && uploadedAudioUrl) {
            ambientSoundRef.current.src = uploadedAudioUrl;
            ambientSoundRef.current.play().catch(err => {
              console.error('Error playing custom sound:', err);
              toast({
                title: 'Error playing sound',
                description: 'Could not play your uploaded sound.',
                variant: 'destructive'
              });
            });
          }
        }
      }
      
      if (!isDemoMode) {
        // Save to Supabase
        updateAudioSettings({ last_ambient_sound: soundId }).catch(err => {
          console.error('Error saving ambient sound setting:', err);
        });
      }
    }
  };
  
  // Handle custom audio upload
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if it's an audio file
      if (!file.type.startsWith('audio/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an audio file.',
          variant: 'destructive'
        });
        return;
      }
      
      // Create a unique ID for this file
      const id = `custom-${Math.random().toString(36).substring(2, 9)}`;
      const name = file.name.split('.')[0]; // Remove file extension
      
      // Add to custom audio files
      setCustomAudioFiles(prev => [...prev, { id, name, file }]);
      
      // Create object URL for the file
      const url = URL.createObjectURL(file);
      setUploadedAudioUrl(url);
      
      // Select and play the uploaded sound
      setSelectedAmbientSound(id);
      if (ambientSoundRef.current) {
        ambientSoundRef.current.src = url;
        ambientSoundRef.current.play().catch(err => {
          console.error('Error playing uploaded sound:', err);
          toast({
            title: 'Error playing sound',
            description: 'Could not play your uploaded sound.',
            variant: 'destructive'
          });
        });
      }
      
      // Reset the input
      event.target.value = '';
    }
  };
  
  // Toggle loop setting
  const toggleLoop = () => {
    setIsLooping(!isLooping);
    
    if (!isDemoMode) {
      // Save loop setting to Supabase
      updateAudioSettings({ audio_looping: !isLooping }).catch(err => {
        console.error('Error saving loop setting:', err);
      });
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setAudioVolume(volume);
    
    if (!isDemoMode) {
      // Debounce saving to Supabase
      const saveVolumeTimeout = setTimeout(() => {
        updateAudioSettings({ audio_volume: volume }).catch(err => {
          console.error('Error saving volume setting:', err);
        });
      }, 500);
      
      return () => clearTimeout(saveVolumeTimeout);
    }
  };

  const changeTheme = async (theme: 'light' | 'dark' | 'nature' | 'space') => {
    setCurrentTheme(theme);
    
    if (!isDemoMode) {
      // Save theme preference to Supabase
      try {
        await updateFocusSettings({
          preferred_theme: theme
        } as Partial<FocusSettings>);
      } catch (error) {
        console.error('Error saving theme preference:', error);
        // Don't show toast for this to avoid disrupting the user experience
      }
    }
  };

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'dark':
        return 'bg-neutral-900 text-white';
      case 'nature':
        return 'bg-gradient-to-br from-green-50 to-blue-50';
      case 'space':
        return 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white';
      default:
        return 'bg-white';
    }
  };

  const updateFeelingLevel = (level: 'low' | 'medium' | 'high') => {
    setCurrentFeelingLevel(level);
  };

  // Extend timer complete functionality instead of overriding
  useEffect(() => {
    if (timerMode === 'focus' && timeLeft === 0 && !isRunning) {
      // Focus streak is now handled by the Supabase service
    }
  }, [timerMode, timeLeft, isRunning]);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      getThemeClasses()
    )}>
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Theme Switcher and Demo Mode Indicator */}
          <div className="flex justify-between items-center mb-8">
            <h1 className={cn(
              "text-3xl font-bold mb-0",
              currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-900'
            )}>
              <span className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary-500" />
                Focus Space
                {isDemoMode && (
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full ml-2",
                    currentTheme === 'dark' || currentTheme === 'space'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-yellow-100 text-yellow-700'
                  )}>
                    Demo Mode
                  </span>
                )}
              </span>
            </h1>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changeTheme('light')}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  currentTheme === 'light' 
                    ? 'bg-primary-100 text-primary-700' 
                    : currentTheme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : currentTheme === 'space'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                <Sun className="h-5 w-5" />
              </button>
              <button 
                onClick={() => changeTheme('dark')}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  currentTheme === 'dark' 
                    ? 'bg-primary-100 text-primary-700' 
                    : currentTheme === 'space'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                <Moon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => changeTheme('nature')}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  currentTheme === 'nature' 
                    ? 'bg-primary-100 text-primary-700' 
                    : currentTheme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : currentTheme === 'space'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                <span className="text-lg">🌿</span>
              </button>
              <button 
                onClick={() => changeTheme('space')}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  currentTheme === 'space' 
                    ? 'bg-primary-100 text-primary-700' 
                    : currentTheme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                <span className="text-lg">✨</span>
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Focus State */}
            <div className="md:col-span-1">
              <div className={cn(
                "rounded-2xl shadow-lg overflow-hidden",
                currentTheme === 'dark' ? 'bg-neutral-800' : 
                currentTheme === 'space' ? 'bg-indigo-800/50 backdrop-blur-sm' : 'bg-white'
              )}>
                <div className="p-6">
                  <h2 className={cn(
                    "text-xl font-semibold mb-4",
                    currentTheme === 'dark' ? 'text-white' : 
                    currentTheme === 'space' ? 'text-white' : 
                    'text-neutral-900'
                  )}>
                    How are you feeling?
                  </h2>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => updateFeelingLevel('high')}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        currentFeelingLevel === 'high' 
                          ? 'bg-green-100 text-green-700' 
                          : currentTheme === 'dark' || currentTheme === 'space'
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                      )}
                    >
                      <Zap className="h-5 w-5" />
                      <span>High Energy</span>
                    </button>
                    
                    <button
                      onClick={() => updateFeelingLevel('medium')}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        currentFeelingLevel === 'medium' 
                          ? 'bg-blue-100 text-blue-700' 
                          : currentTheme === 'dark' || currentTheme === 'space'
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                      )}
                    >
                      <Flame className="h-5 w-5" />
                      <span>Medium Energy</span>
                    </button>
                    
                    <button
                      onClick={() => updateFeelingLevel('low')}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        currentFeelingLevel === 'low' 
                          ? 'bg-purple-100 text-purple-700' 
                          : currentTheme === 'dark' || currentTheme === 'space'
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                      )}
                    >
                      <Moon className="h-5 w-5" />
                      <span>Low Energy</span>
                    </button>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className={cn(
                    "mt-4 p-4 rounded-lg",
                    currentTheme === 'dark' ? 'bg-neutral-700' : 
                    currentTheme === 'space' ? 'bg-indigo-700/50' : 'bg-neutral-50'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className={cn(
                        "h-4 w-4",
                        currentTheme === 'dark' || currentTheme === 'space' ? 'text-primary-400' : 'text-primary-500'
                      )} />
                      <h3 className={cn(
                        "font-medium",
                        currentTheme === 'dark' ? 'text-white' : 
                        currentTheme === 'space' ? 'text-white' : 
                        'text-neutral-900'
                      )}>
                        Focus Streak
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-2xl font-bold",
                        currentTheme === 'dark' ? 'text-white' : 
                        currentTheme === 'space' ? 'text-white' : 
                        'text-neutral-900'
                      )}>
                        {focusStreak}
                      </span>
                      <span className={cn(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-white/80' : 
                        currentTheme === 'space' ? 'text-white/80' : 
                        'text-neutral-600'
                      )}>
                        completed sessions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Timer */}
            <div className="md:col-span-1">
        {/* Timer Card */}
              <div className={cn(
                "rounded-2xl shadow-lg overflow-hidden",
                currentTheme === 'dark' ? 'bg-neutral-800' : 
                currentTheme === 'space' ? 'bg-indigo-800/50 backdrop-blur-sm' : 'bg-white'
              )}>
          {/* Timer Mode Tabs */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => changeTimerMode('focus')}
              className={cn(
                'flex-1 py-3 text-center font-medium transition-colors',
                timerMode === 'focus'
                        ? currentTheme === 'dark' || currentTheme === 'space'
                          ? 'bg-white/10 text-white border-b-2 border-primary-500'
                          : 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                        : currentTheme === 'dark' || currentTheme === 'space'
                          ? 'text-white/70 hover:bg-white/5'
                  : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              Focus
            </button>
            <button
              onClick={() => changeTimerMode('shortBreak')}
              className={cn(
                'flex-1 py-3 text-center font-medium transition-colors',
                timerMode === 'shortBreak'
                        ? currentTheme === 'dark' || currentTheme === 'space'
                          ? 'bg-white/10 text-white border-b-2 border-green-500'
                          : 'bg-green-50 text-green-700 border-b-2 border-green-500'
                        : currentTheme === 'dark' || currentTheme === 'space'
                          ? 'text-white/70 hover:bg-white/5'
                  : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              Short Break
            </button>
            <button
              onClick={() => changeTimerMode('longBreak')}
              className={cn(
                'flex-1 py-3 text-center font-medium transition-colors',
                timerMode === 'longBreak'
                        ? currentTheme === 'dark' || currentTheme === 'space'
                          ? 'bg-white/10 text-white border-b-2 border-blue-500'
                          : 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                        : currentTheme === 'dark' || currentTheme === 'space'
                          ? 'text-white/70 hover:bg-white/5'
                  : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              Long Break
            </button>
          </div>
          
          {/* Timer Display */}
          <div className="p-8 flex flex-col items-center">
            <div className="relative w-64 h-64 mb-8">
              {/* Progress Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                        className={cn(
                          "fill-none",
                          currentTheme === 'dark' || currentTheme === 'space' 
                            ? "stroke-neutral-700" 
                            : "stroke-neutral-100"
                        )}
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className={cn(
                    "stroke-current fill-none transition-all duration-1000 ease-linear",
                    timerMode === 'focus' ? 'text-primary-500' : 
                    timerMode === 'shortBreak' ? 'text-green-500' : 'text-blue-500'
                  )}
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * calculateProgress()) / 100}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn(
                        "text-5xl font-bold",
                        currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-900'
                      )}>
                  {formatTime(timeLeft)}
                </span>
                      <span className={cn(
                        "text-sm mt-2",
                        currentTheme === 'dark' || currentTheme === 'space' ? 'text-white/70' : 'text-neutral-500'
                      )}>
                  {getModeText()}
                </span>
              </div>
            </div>
            
            {/* Timer Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={resetTimer}
                      className={cn(
                        "p-3 rounded-full transition-colors",
                        currentTheme === 'dark' || currentTheme === 'space'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      )}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              {isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="p-5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Pause className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={startTimer}
                  className={cn(
                    "p-5 rounded-full text-white transition-colors",
                    timerMode === 'focus' ? 'bg-primary-500 hover:bg-primary-600' : 
                    timerMode === 'shortBreak' ? 'bg-green-500 hover:bg-green-600' : 
                    'bg-blue-500 hover:bg-blue-600'
                  )}
                >
                  <Play className="w-6 h-6" />
                </button>
              )}
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                      className={cn(
                        "p-3 rounded-full transition-colors",
                        currentTheme === 'dark' || currentTheme === 'space'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      )}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Session Counter */}
          <div className="px-8 pb-6 flex justify-center">
            <div className="flex items-center gap-2">
              {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    i < (sessionsCompleted % settings.sessionsUntilLongBreak) || 
                    (i === 0 && sessionsCompleted % settings.sessionsUntilLongBreak === 0 && sessionsCompleted > 0)
                      ? "bg-primary-500"
                            : currentTheme === 'dark' || currentTheme === 'space'
                              ? "bg-white/20"
                      : "bg-neutral-200"
                  )}
                />
              ))}
            </div>
                  <div className={cn(
                    "ml-4 text-sm",
                    currentTheme === 'dark' || currentTheme === 'space' ? 'text-white/70' : 'text-neutral-500'
                  )}>
              {sessionsCompleted} sessions completed
            </div>
          </div>
          
          {/* Settings Button */}
          <div className="px-8 pb-6 flex justify-center">
            <button
              onClick={() => setShowSettings(!showSettings)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                      currentTheme === 'dark' || currentTheme === 'space'
                        ? 'border-white/20 text-white hover:bg-white/10'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    )}
            >
              <Settings className="w-4 h-4" />
              <span>Timer Settings</span>
            </button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Additional Features */}
            <div className="md:col-span-1">
              {/* Support Tools */}
              <div className={cn(
                "rounded-2xl shadow-lg overflow-hidden mb-6",
                currentTheme === 'dark' ? 'bg-neutral-800' : 
                currentTheme === 'space' ? 'bg-indigo-800/50 backdrop-blur-sm' : 'bg-white'
              )}>
                <div className="p-6">
                  <h2 className={cn(
                    "text-xl font-semibold mb-4",
                    currentTheme === 'dark' ? 'text-white' : 
                    currentTheme === 'space' ? 'text-white' : 
                    'text-neutral-900'
                  )}>
                    Support Tools
                  </h2>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={toggleAmbientSounds}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        showAmbientSounds
                          ? 'bg-primary-100 text-primary-700'
                          : currentTheme === 'dark' || currentTheme === 'space'
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5" />
                        <span>Ambient Sounds</span>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        currentTheme === 'dark' || currentTheme === 'space'
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      )}>
                        {selectedAmbientSound ? 'On' : 'Off'}
                      </span>
                    </button>
                    
                    <button
                      onClick={toggleMotivation}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        showMotivation
                          ? 'bg-primary-100 text-primary-700'
                          : currentTheme === 'dark' || currentTheme === 'space'
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5" />
                        <span>Motivation</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={toggleFocusTips}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        showFocusTips
                          ? 'bg-primary-100 text-primary-700'
                          : currentTheme === 'dark' || currentTheme === 'space'
                            ? 'hover:bg-white/10 text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5" />
                        <span>Focus Tips</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Ambient Sounds Panel */}
                <AnimatePresence>
                  {showAmbientSounds && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        "px-6 pb-6",
                        currentTheme === 'dark' ? 'bg-neutral-700/50' : 
                        currentTheme === 'space' ? 'bg-indigo-700/30' : 'bg-neutral-50'
                      )}>
                        <div className="grid grid-cols-2 gap-2 pt-4">
                          {ambientSounds.map(sound => (
                            <button
                              key={sound.id}
                              onClick={() => selectAmbientSound(sound.id)}
                              className={cn(
                                "p-3 rounded-lg flex items-center gap-2 transition-colors",
                                selectedAmbientSound === sound.id
                                  ? currentTheme === 'dark' || currentTheme === 'space'
                                    ? 'bg-primary-500/30 text-white'
                                    : 'bg-primary-100 text-primary-700'
                                  : currentTheme === 'dark'
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : currentTheme === 'space'
                                      ? 'bg-white/10 text-white hover:bg-white/20'
                                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                              )}
                            >
                              <span className="text-lg">{sound.icon}</span>
                              <span>{sound.name}</span>
                            </button>
                          ))}
                          
                          {/* Custom uploaded sounds */}
                          {customAudioFiles.map(sound => (
                            <button
                              key={sound.id}
                              onClick={() => selectAmbientSound(sound.id)}
                              className={cn(
                                "p-3 rounded-lg flex items-center gap-2 transition-colors",
                                selectedAmbientSound === sound.id
                                  ? currentTheme === 'dark' || currentTheme === 'space'
                                    ? 'bg-primary-500/30 text-white'
                                    : 'bg-primary-100 text-primary-700'
                                  : currentTheme === 'dark'
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : currentTheme === 'space'
                                      ? 'bg-white/10 text-white hover:bg-white/20'
                                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                              )}
                            >
                              <span className="text-lg">🎵</span>
                              <span>{sound.name}</span>
                            </button>
                          ))}
                        </div>
                        
                        {/* Upload custom sound button */}
                        <div className="mt-4">
                          <label
                            htmlFor="audio-upload"
                            className={cn(
                              "flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-colors w-full",
                              currentTheme === 'dark'
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : currentTheme === 'space'
                                  ? 'bg-white/10 text-white hover:bg-white/20'
                                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                            )}
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload your music</span>
                            <input
                              id="audio-upload"
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={handleAudioUpload}
                            />
                          </label>
                        </div>
                        
                        {/* Audio controls */}
                        {selectedAmbientSound && (
                          <div className="mt-4 space-y-3">
                            {/* Volume control */}
                            <div className="flex items-center gap-2">
                              <VolumeX className="h-4 w-4 text-neutral-500" />
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={audioVolume}
                                onChange={handleVolumeChange}
                                className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-neutral-200"
                              />
                              <Volume2 className="h-4 w-4 text-neutral-500" />
                            </div>
                            
                            {/* Loop toggle */}
                            <button
                              onClick={toggleLoop}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg w-full transition-colors",
                                isLooping
                                  ? currentTheme === 'dark' || currentTheme === 'space'
                                    ? 'bg-primary-500/30 text-white'
                                    : 'bg-primary-100 text-primary-700'
                                  : currentTheme === 'dark'
                                    ? 'bg-white/10 text-white'
                                    : currentTheme === 'space'
                                      ? 'bg-white/10 text-white'
                                      : 'bg-white text-neutral-700 border border-neutral-200'
                              )}
                            >
                              <Repeat className="h-4 w-4" />
                              <span>{isLooping ? 'Looping Enabled' : 'Enable Looping'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Motivation Panel */}
                <AnimatePresence>
                  {showMotivation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        "px-6 pb-6",
                        currentTheme === 'dark' ? 'bg-neutral-700/50' : 
                        currentTheme === 'space' ? 'bg-indigo-700/30' : 'bg-neutral-50'
                      )}>
                        <div className="pt-4 text-center">
                          <p className={cn(
                            "text-lg font-medium italic",
                            currentTheme === 'dark' ? 'text-white' : 
                            currentTheme === 'space' ? 'text-white' : 
                            currentTheme === 'nature' ? 'text-neutral-800' : 'text-neutral-700'
                          )}>
                            "{currentMotivation}"
                          </p>
                          <button
                            onClick={toggleMotivation}
                            className={cn(
                              "mt-4 px-3 py-1 rounded-lg text-sm transition-colors",
                              currentTheme === 'dark'
                                ? 'bg-white/20 text-white hover:bg-white/30'
                                : currentTheme === 'space'
                                  ? 'bg-white/20 text-white hover:bg-white/30'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            )}
                          >
                            New Quote
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Focus Tips Panel */}
                <AnimatePresence>
                  {showFocusTips && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        "px-6 pb-6",
                        currentTheme === 'dark' ? 'bg-neutral-700/50' : 
                        currentTheme === 'space' ? 'bg-indigo-700/30' : 'bg-neutral-50'
                      )}>
                        <div className="pt-4">
                          <div className="space-y-3">
                            {focusTips.slice(0, 3).map((tip, index) => (
                              <div 
                                key={index}
                                className={cn(
                                  "p-3 rounded-lg",
                                  currentTheme === 'dark' || currentTheme === 'space'
                                    ? 'bg-white/10'
                                    : 'bg-white'
                                )}
                              >
                                <h3 className={cn(
                                  "font-medium mb-1",
                                  currentTheme === 'dark' ? 'text-white' : 
                                  currentTheme === 'space' ? 'text-white' : 
                                  'text-neutral-900'
                                )}>
                                  {tip.title}
                                </h3>
                                <p className={cn(
                                  "text-sm",
                                  currentTheme === 'dark' ? 'text-white' : 
                                  currentTheme === 'space' ? 'text-white' : 
                                  currentTheme === 'nature' ? 'text-neutral-800' : 
                                  'text-neutral-700'
                                )}>
                                  {tip.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>
        </div>
        
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "rounded-xl shadow-xl max-w-md w-full p-6",
                  currentTheme === 'dark' ? 'bg-neutral-800 text-white' : 
                  currentTheme === 'space' ? 'bg-indigo-900 text-white' : 'bg-white'
                )}
            >
              <div className="flex justify-between items-center mb-6">
                  <h2 className={cn(
                    "text-xl font-bold",
                    currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-900'
                  )}>
                    Timer Settings
                  </h2>
                <button
                  onClick={() => setShowSettings(false)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      currentTheme === 'dark' || currentTheme === 'space'
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-neutral-100 text-neutral-500'
                    )}
                  >
                    <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Focus Time Setting */}
                <div>
                    <label className={cn(
                      "block text-sm font-medium mb-2",
                      currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-700'
                    )}>
                    Focus Time (minutes)
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateSetting('focusTime', Math.max(1, settings.focusTime - 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                      <span className={cn(
                        "w-16 text-center text-lg font-medium",
                        currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-900'
                      )}>
                      {settings.focusTime}
                    </span>
                    <button
                      onClick={() => updateSetting('focusTime', Math.min(60, settings.focusTime + 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Short Break Setting */}
                <div>
                    <label className={cn(
                      "block text-sm font-medium mb-2",
                      currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-700'
                    )}>
                    Short Break (minutes)
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateSetting('shortBreakTime', Math.max(1, settings.shortBreakTime - 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                      <span className={cn(
                        "w-16 text-center text-lg font-medium",
                        currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-900'
                      )}>
                      {settings.shortBreakTime}
                    </span>
                    <button
                      onClick={() => updateSetting('shortBreakTime', Math.min(30, settings.shortBreakTime + 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Long Break Setting */}
                <div>
                    <label className={cn(
                      "block text-sm font-medium mb-2",
                      currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-700'
                    )}>
                    Long Break (minutes)
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateSetting('longBreakTime', Math.max(1, settings.longBreakTime - 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                      <span className={cn(
                        "w-16 text-center text-lg font-medium",
                        currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-900'
                      )}>
                      {settings.longBreakTime}
                    </span>
                    <button
                      onClick={() => updateSetting('longBreakTime', Math.min(60, settings.longBreakTime + 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Sessions Until Long Break Setting */}
                <div>
                    <label className={cn(
                      "block text-sm font-medium mb-2",
                      currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-700'
                    )}>
                    Sessions Until Long Break
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateSetting('sessionsUntilLongBreak', Math.max(1, settings.sessionsUntilLongBreak - 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                      <span className={cn(
                        "w-16 text-center text-lg font-medium",
                        currentTheme === 'dark' || currentTheme === 'space' ? 'text-white' : 'text-neutral-900'
                      )}>
                      {settings.sessionsUntilLongBreak}
                    </span>
                    <button
                      onClick={() => updateSetting('sessionsUntilLongBreak', Math.min(10, settings.sessionsUntilLongBreak + 1))}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme === 'dark' || currentTheme === 'space'
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        )}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                    onClick={saveSettings}
                  className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 