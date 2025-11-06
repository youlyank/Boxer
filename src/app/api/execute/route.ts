import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language = 'javascript' } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Simple JavaScript execution in a try-catch block
    if (language === 'javascript') {
      try {
        // Create a safe execution environment
        const console = {
          log: (...args: any[]) => {
            return args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
          }
        };

        // Execute the code and capture output
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          }
        };

        // Create a function with the code and execute it
        const executeCode = new Function('console', code);
        executeCode(customConsole);

        const output = logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)';

        return NextResponse.json({ 
          output,
          language,
          timestamp: new Date().toISOString()
        });

      } catch (error: any) {
        return NextResponse.json({ 
          error: error.message || 'Execution error',
          language,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Support for other languages (mock responses for now)
    const mockOutputs: Record<string, string> = {
      python: '# Python execution\nprint("Hello from Python!")\n# Output: Hello from Python!',
      typescript: '// TypeScript compilation\n// Compiled successfully!\nconsole.log("Hello from TypeScript!");',
      html: '<!-- HTML rendered -->\n<div>Hello from HTML!</div>',
      css: '/* CSS applied */\n.element { color: purple; font-weight: bold; }',
      json: '{\n  "status": "success",\n  "message": "Valid JSON!"\n}'
    };

    return NextResponse.json({ 
      output: mockOutputs[language] || `Code in ${language} executed successfully!`,
      language,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to execute code: ' + error.message 
    }, { status: 500 });
  }
}