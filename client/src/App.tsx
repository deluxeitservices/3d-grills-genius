import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/shop" component={Shop}/>
      <Route path="/product/:id" component={ProductDetail}/>
      <Route path="/about" component={About}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/faq" component={FAQ}/>
      <Route path="/cart" component={Cart}/>
      <Route path="/checkout" component={Checkout}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* We selectively wrap routes in Layout so Checkout can have a different design */}
        <Switch>
          <Route path="/checkout" component={Checkout} />
          <Route>
            <Layout>
              <Router />
            </Layout>
          </Route>
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;