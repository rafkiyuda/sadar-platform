import { Dashboard } from '@/app/components/alerts/Dashboard';

export default function Home() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    return <Dashboard apiKey={apiKey} />;
}
