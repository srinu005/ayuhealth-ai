export interface Language {
  name: string;
  nativeName: string;
  code: string;
  bcp47: string;
  greeting: string;
  closing: string;
  voiceKeywords: string[];
}

export const LANGUAGES: Language[] = [
  { 
    name: 'English', 
    nativeName: 'English', 
    code: 'en', 
    bcp47: 'en-IN',
    greeting: "Hello! I am your Medical AI Agent. I have received your details. Please tell me how you are feeling and what your symptoms are?",
    closing: "You will feel better soon. Stay positive!",
    voiceKeywords: ['english', 'en-in', 'en-gb', 'en-us']
  },
  { 
    name: 'Hindi', 
    nativeName: 'हिन्दी', 
    code: 'hi', 
    bcp47: 'hi-IN',
    greeting: "नमस्ते! मैं आपका मेडिकल AI एजेंट हूँ। आपका विवरण प्राप्त हुआ। कृपया मुझे बताएं कि आप कैसा महसूस कर रहे हैं और आपके लक्षण क्या हैं?",
    closing: "आप जल्द ही बेहतर महसूस करेंगे। सकारात्मक रहें!",
    voiceKeywords: ['hindi', 'hi-in', 'hi', 'हिन्दी']
  },
  { 
    name: 'Telugu', 
    nativeName: 'తెలుగు', 
    code: 'te', 
    bcp47: 'te-IN',
    greeting: "నమస్కారం! నేను మీ మెడికల్ AI ఏజెంట్‌ను. మీ వివరాలు అందాయి. దయచేసి మీకు ఎలా అనిపిస్తుందో మరియు మీ లక్షణాలు ఏమిటో చెప్పండి?",
    closing: "మీరు త్వరలోనే కోలుకుంటారు. సానుకూలంగా ఉండండి!",
    voiceKeywords: ['telugu', 'te-in', 'te', 'తెలుగు']
  },
  { 
    name: 'Tamil', 
    nativeName: 'தமிழ்', 
    code: 'ta', 
    bcp47: 'ta-IN',
    greeting: "வணக்கம்! நான் உங்கள் மருத்துவ AI முகவர். உங்கள் விவரங்கள் கிடைத்தன. நீங்கள் எப்படி உணருகிறீர்கள் மற்றும் உங்கள் அறிகுறிகள் என்ன என்பதை தயவுசெய்து சொல்லுங்கள்?",
    closing: "நீங்கள் விரைவில் குணமடைவீர்கள். நேர்மறையாக இருங்கள்!",
    voiceKeywords: ['tamil', 'ta-in', 'ta', 'தமிழ்']
  },
  { 
    name: 'Kannada', 
    nativeName: 'ಕನ್ನಡ', 
    code: 'kn', 
    bcp47: 'kn-IN',
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ AI ಏಜೆಂಟ್. ನಿಮ್ಮ ವಿವರಗಳು ಲಭ್ಯವಾಗಿವೆ. ದಯವಿಟ್ಟು ನಿಮಗೆ ಹೇಗನ್ನಿಸುತ್ತಿದೆ ಮತ್ತು ನಿಮ್ಮ ಲಕ್ಷಣಗಳೇನು ಎಂದು ತಿಳಿಸಿ?",
    closing: "ನೀವು ಶೀಘ್ರದಲ್ಲೇ ಗುಣಮುಖರಾಗುತ್ತೀರಿ. ಧನಾತ್ಮಕವಾಗಿರಿ!",
    voiceKeywords: ['kannada', 'kn-in', 'kn', 'ಕನ್ನಡ']
  },
  { 
    name: 'Malayalam', 
    nativeName: 'മലയാളം', 
    code: 'ml', 
    bcp47: 'ml-IN',
    greeting: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ മെഡിക്കൽ AI ഏജന്റാണ്. നിങ്ങളുടെ വിവരങ്ങൾ ലഭിച്ചു. നിങ്ങൾക്ക് എങ്ങനെയുണ്ട് എന്നും നിങ്ങളുടെ ലക്ഷണങ്ങൾ എന്താണെന്നും ദയവായി പറയുക?",
    closing: "നിങ്ങൾ ഉടൻ സുഖം പ്രാപിക്കും. പോസിറ്റീവ് ആയിരിക്കുക!",
    voiceKeywords: ['malayalam', 'ml-in', 'ml', 'മലയാളം']
  },
  { 
    name: 'Bengali', 
    nativeName: 'বাংলা', 
    code: 'bn', 
    bcp47: 'bn-IN',
    greeting: "নমস্কার! আমি আপনার মেডিকেল AI এজেন্ট। আপনার বিবরণ পাওয়া গেছে। দয়া করে বলুন আপনি কেমন বোধ করছেন এবং আপনার লক্ষণগুলি কী কী?",
    closing: "আপনি শীঘ্রই সুস্থ হয়ে উঠবেন। ইতিবাচক থাকুন!",
    voiceKeywords: ['bengali', 'bn-in', 'bn', 'বাংলা']
  },
  { 
    name: 'Marathi', 
    nativeName: 'मराठी', 
    code: 'mr', 
    bcp47: 'mr-IN',
    greeting: "नमस्कार! मी तुमचा मेडिकल AI एजंट आहे. तुमची माहिती मिळाली आहे. कृपया तुम्हाला कसे वाटत आहे आणि तुमची लक्षणे काय आहेत ते सांगा?",
    closing: "तुम्हाला लवकरच बरे वाटेल. सकारात्मक रहा!",
    voiceKeywords: ['marathi', 'mr-in', 'mr', 'मराठी']
  },
  { 
    name: 'Gujarati', 
    nativeName: 'ગુજરાતી', 
    code: 'gu', 
    bcp47: 'gu-IN',
    greeting: "નમસ્તે! હું તમારો મેડિકલ AI એજન્ટ છું. તમારી વિગતો મળી ગઈ છે. કૃપા કરીને મને જણાવો કે તમે કેવું અનુભવી રહ્યા છો અને તમારા લક્ષણો શું છે?",
    closing: "તમે જલ્દી સાજા થઈ જશો. સકારાત્મક રહો!",
    voiceKeywords: ['gujarati', 'gu-in', 'gu', 'ગુજરાતી']
  },
  { 
    name: 'Punjabi', 
    nativeName: 'ਪੰਜਾਬੀ', 
    code: 'pa', 
    bcp47: 'pa-IN',
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਮੈਡੀਕਲ AI ਏਜੰਟ ਹਾਂ। ਤੁਹਾਡੇ ਵੇਰਵੇ ਮਿਲ ਗਏ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ ਅਤੇ ਤੁਹਾਡਾ ਲੱਛਣ ਕੀ ਹਨ?",
    closing: "ਤੁਸੀਂ ਜਲਦੀ ਹੀ ਠੀਕ ਹੋ ਜਾਵੋਗੇ। ਸਕਾਰਾਤਮਕ ਰਹੋ!",
    voiceKeywords: ['punjabi', 'pa-in', 'pa', 'ਪੰਜਾਬੀ']
  },
];
