import { Dashboard } from '@/app/components/alerts/Dashboard';

export default function Home() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    return <Dashboard apiKey={apiKey} />;
}
