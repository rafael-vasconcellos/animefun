import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import Home from './src/Home'

function App()  { 
    return (
        <Router>
            <Route path="/" component={Home} />
            <Route path="/search" component={Home} />
        </Router>
    )
}

render(App, document.getElementById('app') as HTMLElement)