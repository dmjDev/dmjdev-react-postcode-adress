import { PostalProvider } from "./context/PostalProvider";
import { Postal } from "./components/Postal/Postal";

export const App = () => {
  return (
    <div className="App">
      <div className="container mx-auto p-8">
        <PostalProvider>
          <Postal />
        </PostalProvider>
      </div>
    </div>
  );
}