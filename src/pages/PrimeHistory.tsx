
import React from 'react';
import Layout from '@/components/Layout';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Download, Trash2, Copy } from 'lucide-react';

interface PrimeHistoryEntry {
  id: string;
  timestamp: string;
  primes: number[];
  journeyTitle?: string;
}

const PrimeHistory: React.FC = () => {
  const [primeHistory, setPrimeHistory] = useLocalStorage<PrimeHistoryEntry[]>('sacred-prime-history', []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your prime number history?')) {
      setPrimeHistory([]);
      toast.success('Prime history cleared');
    }
  };

  const copyPrimes = (primes: number[]) => {
    navigator.clipboard.writeText(primes.join(', '));
    toast.success('Prime numbers copied to clipboard');
  };

  const downloadHistory = () => {
    const historyText = JSON.stringify(primeHistory, null, 2);
    const blob = new Blob([historyText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sacred-prime-history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prime history downloaded');
  };

  return (
    <Layout pageTitle="Prime Number History" theme="cosmic">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2">Sacred Prime Sequence History</h1>
            <p className="text-purple-200/70">
              Your journey through the sacred mathematics of prime numbers
            </p>
          </div>

          <div className="flex space-x-2">
            {primeHistory.length > 0 && (
              <>
                <Button variant="outline" onClick={downloadHistory}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="destructive" onClick={clearHistory}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </>
            )}
          </div>
        </div>

        {primeHistory.length === 0 ? (
          <Card className="bg-purple-900/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="flex flex-col items-center justify-center h-60">
              <p className="text-purple-200">Your prime number history will appear here</p>
              <p className="text-purple-300/70 text-sm mt-2">
                Experience journeys with the visualizer to record prime sequences
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primeHistory.map((entry, index) => (
              <Card key={entry.id + index} className="bg-purple-900/20 backdrop-blur-md border-purple-500/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-purple-100">
                      {entry.journeyTitle || 'Prime Sequence'}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => copyPrimes(entry.primes)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-purple-300/70">
                    {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.primes.map((prime, i) => (
                      <Badge key={i} variant="outline" className="bg-purple-700/30">
                        {prime}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PrimeHistory;
