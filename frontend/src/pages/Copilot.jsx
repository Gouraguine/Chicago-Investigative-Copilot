import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  Bot,
  BrainCircuit,
  Database,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react"

import {
  askCopilot,
} from "../services/api"

import { useLocation } from "react-router"

import Panel from "../components/dashboard/Panel"


const SUGGESTED_QUESTIONS = [
  "What are the most common crime types?",
  "What was the peak historical crime month?",
  "Which crime types have the most arrests?",
  "What are the highest risk areas?",
  "What are the top future hotspots?",
]


function Copilot() {

  const location = useLocation()

  const [question, setQuestion] =
    useState(location.state?.question ?? "")

  const [messages, setMessages] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState(null)

  const conversationEndRef =
    useRef(null)


  useEffect(() => {

    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })

  }, [messages, loading])


  async function submitQuestion(
    questionToSubmit,
  ) {

    const cleanQuestion =
      questionToSubmit.trim()

    if (!cleanQuestion || loading) {
      return
    }


    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      question: cleanQuestion,
    }


    setMessages((current) => [
      ...current,
      userMessage,
    ])

    setQuestion("")
    setLoading(true)
    setError(null)


    try {

      const response =
        await askCopilot(
          cleanQuestion
        )


      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        answer: response.answer,
        contextType:
          response.context_type,
      }


      setMessages((current) => [
        ...current,
        assistantMessage,
      ])

    } catch (err) {

      console.error(err)

      setError(
        "Crime Copilot could not process the request."
      )

    } finally {

      setLoading(false)

    }

  }


  function handleSubmit(event) {

    event.preventDefault()

    submitQuestion(question)

  }


  function handleKeyDown(event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault()

      submitQuestion(question)

    }

  }


  return (
    <section>

      {/* HEADER */}

      <div
        className="
          mb-7
          flex flex-col
          gap-5
          xl:flex-row
          xl:items-end
          xl:justify-between
        "
      >

        <div>

          <p className="intel-label">
            AI Intelligence Analyst
          </p>

          <h2 className="page-title">
            Crime Copilot
          </h2>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-600
            "
          >
            Query historical crime data,
            geographic risk intelligence and
            predictive analytics using natural
            language.
          </p>

        </div>


        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-md
            border border-emerald-500/20
            bg-emerald-500/[0.06]
            px-3 py-2
          "
        >

          <span
            className="
              h-1.5 w-1.5
              rounded-full
              bg-emerald-400
            "
          />

          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-emerald-400
            "
          >
            Intelligence System Online
          </span>

        </div>

      </div>


      {/* MAIN */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-[minmax(0,1fr)_310px]
        "
      >

        {/* CONVERSATION */}

        <Panel
          title="Analyst Conversation"
          subtitle="Natural language intelligence interface"
        >

          <div
            className="
              flex
              h-[640px]
              flex-col
            "
          >

            {/* MESSAGES */}

            <div
              className="
                flex-1
                overflow-y-auto
                pr-2
              "
            >

              {messages.length === 0 && (

                <WelcomeState
                  onQuestion={
                    submitQuestion
                  }
                />

              )}


              <div className="space-y-5">

                {messages.map(
                  (message) => {

                    if (
                      message.role ===
                      "user"
                    ) {

                      return (
                        <UserMessage
                          key={
                            message.id
                          }
                          question={
                            message.question
                          }
                        />
                      )
                    }


                    return (
                      <CopilotMessage
                        key={message.id}
                        answer={
                          message.answer
                        }
                      />
                    )

                  }
                )}


                {loading && (
                  <ThinkingState />
                )}


                {error && (

                  <div
                    className="
                      rounded-md
                      border
                      border-red-500/20
                      bg-red-500/[0.05]
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-red-400
                      "
                    >
                      {error}
                    </p>

                  </div>

                )}


                <div
                  ref={
                    conversationEndRef
                  }
                />

              </div>

            </div>


            {/* INPUT */}

            <form
              onSubmit={handleSubmit}
              className="
                mt-5
                border-t
                border-[#172330]
                pt-4
              "
            >

              <div
                className="
                  relative
                  w-full
                  max-w-2xl
                  overflow-hidden
                  rounded-lg
                  border border-[#223246]
                  bg-[#080e15]
                  sm:rounded-xl
                  transition
                  focus-within:border-blue-500/40
                "
              >

                <textarea
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  disabled={loading}
                  maxLength={500}
                  rows={3}
                  placeholder="Ask Crime Copilot about crime trends, risk areas, hotspots or forecasts..."
                  className="
                    block
                    w-full
                    resize-none
                    bg-transparent
                    px-4
                    pb-11
                    pt-4
                    text-sm
                    leading-6
                    text-slate-200
                    outline-none
                    placeholder:text-slate-700
                    disabled:opacity-60
                  "
                />


                <div
                  className="
                    absolute
                    bottom-3
                    left-4
                    right-3
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <span
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.11em]
                      text-slate-700
                    "
                  >
                    Enter to send ·
                    Shift + Enter for
                    new line
                  </span>


                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !question.trim()
                    }
                    className="
                      flex
                      h-8
                      items-center
                      gap-2
                      rounded-md
                      bg-blue-600
                      px-3
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.11em]
                      text-white
                      transition
                      hover:bg-blue-500
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >

                    <Send
                      size={13}
                      strokeWidth={1.8}
                    />

                    Send

                  </button>

                </div>

              </div>

            </form>

          </div>

        </Panel>


        {/* RIGHT SIDEBAR */}

        <div className="space-y-4">

          <Panel
            title="Active Context"
            subtitle="Intelligence environment"
          >

            <div className="space-y-3">

              <ContextItem
                icon={Database}
                label="Data Source"
                value="SQLite Analytics"
                status="Connected"
              />

              <ContextItem
                icon={BrainCircuit}
                label="AI Engine"
                value="Groq"
                status="Connected"
              />

              <ContextItem
                icon={ShieldCheck}
                label="Data Access"
                value="Controlled Context"
                status="Protected"
              />

            </div>

          </Panel>


          <Panel
            title="Suggested Queries"
            subtitle="Intelligence shortcuts"
          >

            <div className="space-y-2">

              {SUGGESTED_QUESTIONS.map(
                (
                  suggestedQuestion,
                  index,
                ) => (

                  <button
                    type="button"
                    key={
                      suggestedQuestion
                    }
                    disabled={loading}
                    onClick={() =>
                      submitQuestion(
                        suggestedQuestion
                      )
                    }
                    className="
                      group
                      flex
                      w-full
                      items-start
                      gap-3
                      rounded-md
                      border
                      border-[#172330]
                      bg-[#091018]
                      p-3
                      text-left
                      transition
                      hover:border-blue-500/20
                      hover:bg-blue-500/[0.04]
                      disabled:opacity-50
                    "
                  >

                    <span
                      className="
                        pt-0.5
                        font-mono
                        text-[9px]
                        text-slate-700
                      "
                    >
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>


                    <span
                      className="
                        text-[11px]
                        leading-5
                        text-slate-500
                        transition
                        group-hover:text-slate-300
                      "
                    >
                      {
                        suggestedQuestion
                      }
                    </span>

                  </button>

                )
              )}

            </div>

          </Panel>


          <Panel
            title="Analytical Scope"
            subtitle="Available intelligence"
          >

            <div
              className="
                space-y-3
                text-[10px]
                leading-5
                text-slate-500
              "
            >

              <ScopeItem>
                Historical crime
                classifications
              </ScopeItem>

              <ScopeItem>
                Monthly crime trends
              </ScopeItem>

              <ScopeItem>
                Arrest statistics
              </ScopeItem>

              <ScopeItem>
                Geographic risk areas
              </ScopeItem>

              <ScopeItem>
                Predicted hotspots
              </ScopeItem>

            </div>

          </Panel>

        </div>

      </div>

    </section>
  )
}


function WelcomeState({
  onQuestion,
}) {

  return (
    <div
      className="
        flex
        min-h-[470px]
        items-center
        justify-center
        px-6
        pt-3
        sm:pt-[8vh]
        lg:pt-[10vh]
      "
    >

      <div
        className="
          max-w-lg
          text-center
        "
      >

        <div
          className="
            mx-auto
            flex h-12 w-12
            items-center
            justify-center
            rounded-lg
            border border-blue-500/20
            bg-blue-500/[0.07]
          "
        >

          <BrainCircuit
            size={22}
            strokeWidth={1.5}
            className="text-blue-400"
          />

        </div>


        <p
          className="
            mt-5
            text-sm
            font-semibold
            text-slate-300
          "
        >
          Crime Intelligence
          Query Interface
        </p>


        <p
          className="
            mx-auto
            mt-2
            max-w-md
            text-xs
            leading-6
            text-slate-600
          "
        >
          Ask questions about the
          historical dataset, crime
          classifications, geographic
          risk and predictive analytics.
        </p>


        <button
          type="button"
          onClick={() =>
            onQuestion(
              "What are the most common crime types?"
            )
          }
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-md
            border border-blue-500/20
            bg-blue-500/[0.06]
            px-4 py-2.5
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.11em]
            text-blue-400
            transition
            hover:bg-blue-500/[0.1]
          "
        >

          <Sparkles
            size={13}
          />

          Run Example Analysis

        </button>

      </div>

    </div>
  )
}


function UserMessage({
  question,
}) {

  return (
    <div
      className="
        flex
        justify-end
        gap-3
      "
    >

      <div
        className="
          max-w-[78%]
          rounded-lg
          border border-[#24364a]
          bg-[#111b27]
          px-4 py-3
        "
      >

        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.13em]
            text-slate-600
          "
        >
          Analyst Query
        </p>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-300
          "
        >
          {question}
        </p>

      </div>


      <div
        className="
          flex h-8 w-8
          shrink-0
          items-center
          justify-center
          rounded-md
          border border-[#223246]
          bg-[#0c141e]
        "
      >

        <User
          size={14}
          className="text-slate-500"
        />

      </div>

    </div>
  )
}


function CopilotMessage({
  answer,
}) {

  if (!answer) {
    return null
  }


  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      <div
        className="
          flex h-8 w-8
          shrink-0
          items-center
          justify-center
          rounded-md
          border border-blue-500/20
          bg-blue-500/[0.07]
        "
      >

        <Bot
          size={15}
          className="text-blue-400"
        />

      </div>


      <article
        className="
          min-w-0
          max-w-[88%]
          flex-1
          rounded-lg
          border border-[#1c2b3b]
          bg-[#091018]
          p-5
        "
      >

        {/* TITLE */}

        <div
          className="
            border-b
            border-[#172330]
            pb-4
          "
        >

          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-blue-500
            "
          >
            Crime Copilot Analysis
          </p>


          <h3
            className="
              mt-2
              text-base
              font-semibold
              text-slate-200
            "
          >
            {answer.title}
          </h3>

        </div>


        {/* SUMMARY */}

        <div className="py-4">

          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-slate-600
            "
          >
            Summary
          </p>


          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-400
            "
          >
            {answer.summary}
          </p>

        </div>


        {/* FINDINGS */}

        {answer.findings?.length >
          0 && (

          <div
            className="
              border-t
              border-[#172330]
              py-4
            "
          >

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-slate-600
              "
            >
              Key Findings
            </p>


            <div
              className="
                mt-3
                space-y-2
              "
            >

              {answer.findings.map(
                (
                  finding,
                  index,
                ) => (

                  <div
                    key={
                      `${finding}-${index}`
                    }
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-md
                      border
                      border-[#172330]
                      bg-[#080e15]
                      px-3 py-3
                    "
                  >

                    <span
                      className="
                        pt-0.5
                        font-mono
                        text-[9px]
                        text-blue-500
                      "
                    >
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>


                    <p
                      className="
                        text-xs
                        leading-5
                        text-slate-400
                      "
                    >
                      {finding}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* CONCLUSION */}

        {answer.conclusion && (

          <div
            className="
              border-t
              border-[#172330]
              pt-4
            "
          >

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-slate-600
              "
            >
              Assessment
            </p>


            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-300
              "
            >
              {answer.conclusion}
            </p>

          </div>

        )}

      </article>

    </div>
  )
}


function ThinkingState() {

  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      <div
        className="
          flex h-8 w-8
          items-center
          justify-center
          rounded-md
          border border-blue-500/20
          bg-blue-500/[0.07]
        "
      >

        <Bot
          size={15}
          className="text-blue-400"
        />

      </div>


      <div
        className="
          rounded-lg
          border border-[#1c2b3b]
          bg-[#091018]
          px-4 py-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {[0, 1, 2].map(
            (item) => (

              <span
                key={item}
                className="
                  h-1.5
                  w-1.5
                  animate-pulse
                  rounded-full
                  bg-blue-400
                "
                style={{
                  animationDelay:
                    `${item * 150}ms`,
                }}
              />

            )
          )}

        </div>


        <p
          className="
            mt-2
            text-[9px]
            uppercase
            tracking-[0.12em]
            text-slate-600
          "
        >
          Analyzing intelligence
          context
        </p>

      </div>

    </div>
  )
}


function ContextItem({
  icon: Icon,
  label,
  value,
  status,
}) {

  return (
    <div
      className="
        rounded-md
        border border-[#172330]
        bg-[#091018]
        p-3
      "
    >

      <div
        className="
          flex
          items-start
          gap-3
        "
      >

        <div
          className="
            flex h-8 w-8
            shrink-0
            items-center
            justify-center
            rounded-md
            border border-[#1d2c3c]
            bg-[#0c141e]
          "
        >

          <Icon
            size={14}
            strokeWidth={1.7}
            className="text-slate-500"
          />

        </div>


        <div>

          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.11em]
              text-slate-600
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              text-xs
              font-medium
              text-slate-300
            "
          >
            {value}
          </p>


          <div
            className="
              mt-2
              flex
              items-center
              gap-1.5
            "
          >

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
              "
            />

            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.1em]
                text-emerald-500
              "
            >
              {status}
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}


function ScopeItem({
  children,
}) {

  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <span
        className="
          h-1
          w-1
          rounded-full
          bg-blue-500
        "
      />

      <span>
        {children}
      </span>

    </div>
  )
}


export default Copilot