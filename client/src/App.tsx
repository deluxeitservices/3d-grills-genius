import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import NotFound from "@/pages/not-found";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import CMSPage from "./pages/CMSPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCMS from "./pages/admin/AdminCMS";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminCategoryEdit from "./pages/admin/AdminCategoryEdit";
import AdminContacts from "./pages/admin/AdminContacts";

function AdminPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/shop" component={Shop}/>
      <Route path="/shop/:category" component={Shop}/>
      <Route path="/product/:slug" component={ProductDetail}/>
      <Route path="/about" component={CMSPage}/>
      <Route path="/contact" component={CMSPage}/>
      <Route path="/faq" component={CMSPage}/>
      <Route path="/cart" component={Cart}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
      <Route path="/account" component={Account}/>
      <Route path="/page/:slug" component={CMSPage}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Switch>
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/admin/products/new">{() => <AdminPage component={AdminProductEdit} />}</Route>
              <Route path="/admin/products/edit/:id">{() => <AdminPage component={AdminProductEdit} />}</Route>
              <Route path="/admin/products">{() => <AdminPage component={AdminProducts} />}</Route>
              <Route path="/admin/categories/new">{() => <AdminPage component={AdminCategoryEdit} />}</Route>
              <Route path="/admin/categories/edit/:id">{() => <AdminPage component={AdminCategoryEdit} />}</Route>
              <Route path="/admin/categories">{() => <AdminPage component={AdminCategories} />}</Route>
              <Route path="/admin/contacts">{() => <AdminPage component={AdminContacts} />}</Route>
              <Route path="/admin/banners">{() => <AdminPage component={AdminBanners} />}</Route>
              <Route path="/admin/reviews">{() => <AdminPage component={AdminReviews} />}</Route>
              <Route path="/admin/cms">{() => <AdminPage component={AdminCMS} />}</Route>
              <Route path="/admin/orders">{() => <AdminPage component={AdminOrders} />}</Route>
              <Route path="/admin/subscribers">{() => <AdminPage component={AdminSubscribers} />}</Route>
              <Route path="/admin/seo">{() => <AdminPage component={AdminSEO} />}</Route>
              <Route path="/admin/settings">{() => <AdminPage component={AdminSettings} />}</Route>
              <Route path="/admin">{() => <AdminPage component={AdminDashboard} />}</Route>
              <Route path="/checkout/success" component={CheckoutSuccess} />
              <Route path="/checkout/cancel" component={CheckoutCancel} />
              <Route path="/checkout" component={Checkout} />
              <Route>
                <Layout>
                  <Router />
                </Layout>
              </Route>
            </Switch>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
