import React from 'react'

function toCelsius(fahrenheit: number) {
    return ((fahrenheit - 32) * 5) / 9
}

function toFahrenheit(celsius: number) {
    return (celsius * 9) / 5 + 32
}

function tryConvert(temperature: string, convert: (cel: number) => number) {
    const input = parseFloat(temperature)
    if (Number.isNaN(input)) {
        return ''
    }
    const output = convert(input)
    const rounded = Math.round(output * 1000) / 1000
    return rounded.toString()
}

function BoilingVerdict(props: any) {
    if (props.celsius >= 100) {
        return <p>The water would boil.</p>
    }
    return <p>The water would not boil.</p>
}

type Props = {
    scale: string
    temperature: string
    onTemperatureChange: (temperature: string) => void
}

const scaleNames: { [name: string]: string } = {
    c: 'Celsius',
    f: 'Fahrenheit'
}

class TemperatureInput extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onTemperatureChange(e.target?.value)
    }

    render() {
        const temperature = this.props.temperature
        const scale = this.props.scale
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input value={temperature} onChange={this.handleChange} />
            </fieldset>
        )
    }
}

type AppProps = {
    message: string
}

type State = {
    temperature: string
    scale: string
}

class App extends React.Component<AppProps, State> {
    constructor(props: AppProps) {
        super(props)
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this)
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this)
        this.state = { temperature: '', scale: 'c' }
    }

    async componentDidMount() {
        const res = await fetch('https://petstore.swagger.io/v2/swagger.json')
        const result = await res.json()

        console.log(result)
    }

    handleCelsiusChange(temperature: string) {
        this.setState({ scale: 'c', temperature })
    }

    handleFahrenheitChange(temperature: string) {
        this.setState({ scale: 'f', temperature })
    }

    render() {
        const scale = this.state.scale
        const temperature = this.state.temperature
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature

        return (
            <div>
                <TemperatureInput
                    scale="c"
                    temperature={celsius}
                    onTemperatureChange={this.handleCelsiusChange}
                />
                <TemperatureInput
                    scale="f"
                    temperature={fahrenheit}
                    onTemperatureChange={this.handleFahrenheitChange}
                />
                <BoilingVerdict celsius={parseFloat(celsius)} />
            </div>
        )
    }
}

export default App
