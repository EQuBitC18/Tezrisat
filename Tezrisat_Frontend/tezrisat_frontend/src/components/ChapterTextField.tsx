import {useState} from "react";
import Latex from "react-latex-next";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {Copy} from "lucide-react";
// (Your CodeSnippet component import here)


// @ts-expect-error
const CodeSnippet = ({ code, language = "" }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-gray-900 text-white rounded-md p-4 mb-4">
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {code}
      </SyntaxHighlighter>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-teal-500 hover:bg-teal-600 text-white rounded px-2 py-1 flex items-center"
      >
        {copied ? (
          "Copied!"
        ) : (
          <>
            <Copy className="mr-1" /> Copy
          </>
        )}
      </button>
    </div>
  )
}


const ChapterTextField = ({
// @ts-expect-error
  chapter,
// @ts-expect-error
  content,
  codeExamples = [],
  mathExpressions = [],
}) => {
  return (
    <div className="mb-8 bg-white/10 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        {chapter}
      </h3>

      {/* Main text content (Markdown + LaTeX) */}
      <div className="prose prose-gray dark:prose-invert max-w-none">

        <ReactMarkdown
          children={content}
          rehypePlugins={[rehypeHighlight]}
          // remarkPlugins, etc. as needed
        />
      </div>

      {/* Code Examples */}
      {codeExamples.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
            Code Examples
          </h4>
          {codeExamples.map((example, idx) => (
            <div key={idx} className="mb-4">
                {/*@ts-expect-error*/}
              <p className="font-semibold">{example.description}</p>
              {/*@ts-expect-error*/}
                <CodeSnippet code={example.code} language="java" />
            </div>
          ))}
        </div>
      )}

      {/* Math Expressions */}
      {mathExpressions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
            Math Expressions
          </h4>
          {mathExpressions.map((expr, idx) => (
            <div key={idx} className="mb-4">
              {/*@ts-expect-error*/}
                <p className="font-semibold">{expr.description}</p>
              {/*@ts-expect-error*/}
                <Latex>{expr.expression}</Latex>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterTextField;
