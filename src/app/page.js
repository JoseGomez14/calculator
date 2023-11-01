'use client'

import Styles from '@styles/calculator.module.css'
import { useState } from 'react'

export default function Calculator() {
  const OPERATORS = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
    equals: '=',
  }
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState(false)
  const [errorInput, setErrorInput] = useState('')

  const handleClear = () => {
    setInput('')
    setResult('')
    setError(false)
    setErrorInput('')
  }

  const handleDelete = () => {
    setInput(input.slice(0, -1))
    setError(false)
  }

  const handleInput = (value) => {
    setInput(input + value)
    setError(false)
  }

  const handleNumber = (e) => {
    const value = e.target.id
    if (value === undefined) {
      return
    }
    if (input === '' && value === '0') {
      return
    }
    if (parseInt(input) === NaN) {
      return
    }
    handleInput(value)
  }

  const handleOperator = (e) => {
    const value = e.target.id
    if (value === undefined) {
      return
    }

    if (value === 'equals') {
      return handleCalculate()
    }

    if (OPERATORS[value] === undefined) {
      return
    }
    handleInput(OPERATORS[value])
  }

  const handleParents = (e) => {
    const value = e.target.id
    if (value === 'left-paren') {
      handleInput('(')
    } else if (value === 'right-paren') {
      handleInput(')')
    }
  }

  const checkParenthesis = (str) => {
    const stack = []
    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      if (char === '(') {
        stack.push(i)
      } else if (char === ')') {
        if (stack.length === 0) {
          setResult(`Error: Faltan parentesis '('`)
          setError(true)
          setErrorInput(() => {
            const errorPosition = i
            return (
              <>
                {input.slice(0, errorPosition)}
                <span className={Styles.error}>{input[errorPosition]}</span>
                {input.slice(errorPosition + 1)}
              </>
            )
          })
          return false
        }
        stack.pop()
      }
    }

    if (stack.length !== 0) {
      const error = stack.pop()

      setResult(`Error: Faltan parentesis ')'`)
      setError(true)
      setErrorInput((prev) => {
        const errorPosition = error
        return (
          <>
            {input.slice(0, errorPosition)}
            <span className={Styles.error}>{input[errorPosition]}</span>
            {input.slice(errorPosition + 1)}
          </>
        )
      })

      return false
    }
    return true
  }

  const checkDoubleOperator = (str) => {
    const operators = Object.values(OPERATORS)
    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      if (operators.includes(char) && operators.includes(str[i + 1])) {
        setResult(`Error: Operador duplicado`)
        setError(true)
        setErrorInput((prev) => {
          const errorPosition = i
          return (
            <>
              {input.slice(0, errorPosition)}
              <span className={Styles.error}>{input[errorPosition] + input[errorPosition + 1]}</span>
              {input.slice(errorPosition + 2)}
            </>
          )
        })
        return false
      }
    }
    return true
  }

  const handleCalculate = () => {
    if (input === '') {
      return setResult('0')
    }

    if (!checkParenthesis(input)) {
      return
    }

    if (!checkDoubleOperator(input)) {
      return
    }

    try {
      const result = eval(input)
      setResult(result)
    } catch (e) {
      setResult('Error: Sintaxis incorrecta')
      setError(true)
      setErrorInput(input)
    }
  }

  return (
    <>
      <div className={Styles.main}>
        <div className={Styles.calculator}>
          <div className={Styles.display}>
            {/* <input type='text' className={Styles.input} placeholder={0} value={input} readOnly /> */}
            <div className={Styles.input}>{error ? errorInput : input}</div>
            <div className={Styles.result}>{result}</div>
          </div>
          <div className={Styles.buttosnContainter}>
            <div className={Styles.buttons}>
              <div className={Styles.top}>
                <button
                  id='clear'
                  className={Styles.clear}
                  onClick={() => {
                    handleClear()
                  }}
                >
                  AC
                </button>
                <button
                  id='del'
                  className={Styles.leftParen}
                  onClick={() => {
                    handleDelete()
                  }}
                >
                  Del
                </button>
              </div>
              <div
                className={Styles.numbers}
                onClick={(e) => {
                  handleNumber(e)
                }}
              >
                <button id='9' className={Styles.nine}>
                  9
                </button>
                <button id='8' className={Styles.eight}>
                  8
                </button>
                <button id='7' className={Styles.seven}>
                  7
                </button>
                <button id='6' className={Styles.six}>
                  6
                </button>
                <button id='5' className={Styles.five}>
                  5
                </button>
                <button id='4' className={Styles.four}>
                  4
                </button>
                <button id='3' className={Styles.three}>
                  3
                </button>
                <button id='2' className={Styles.two}>
                  2
                </button>
                <button id='1' className={Styles.one}>
                  1
                </button>
              </div>
              <div
                className={Styles.bottom}
                onClick={(e) => {
                  handleNumber(e)
                  handleParents(e)
                }}
              >
                <button id='0' className={Styles.zero}>
                  0
                </button>
                <button id='left-paren' className={Styles.leftParen}>
                  (
                </button>
                <button id='right-paren' className={Styles.rightParen}>
                  )
                </button>
              </div>
            </div>
            <div
              className={Styles.operators}
              onClick={(e) => {
                handleOperator(e)
              }}
            >
              <button id='divide' className={Styles.divide}>
                /
              </button>
              <button id='multiply' className={Styles.multiply}>
                x
              </button>
              <button id='subtract' className={Styles.subtract}>
                -
              </button>
              <button id='add' className={Styles.add}>
                +
              </button>
              <button id='equals' className={Styles.equals}>
                =
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className={Styles.footer}>
        <div>Desarrollado por: Jose David Gómez Muñetón - Luis Guillermo Sánchez Cubides</div>
      </footer>
    </>
  )
}
