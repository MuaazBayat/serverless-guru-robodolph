import { Card, Title, Text, Grid, Col } from "@tremor/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEnvelope, faSnowflake } from '@fortawesome/free-solid-svg-icons';

export default function Example() {
  return (
    <main className="p-20">
     <div className="container mx-auto text-center">
  <header className="bg-red-600 text-white min-h-screen flex flex-col justify-center items-center">
    <h1 className="text-6xl font-bold mb-4">Welcome to Robodolph!</h1>
    <p className="text-xl">Lets find something for you to do this holiday.</p>
  </header>
  
  <section className="bg-red-700 text-white min-h-screen flex flex-col justify-center items-center">
    <p className="text-lg mb-2">Robodolph is here to help you find holiday jobs with a sprinkle of festive cheer! 🦌</p>
    <p className="text-lg">Whether you're looking for part-time work or one-off tasks, Robodolph has you covered.</p>
  </section>

  <section className="features py-12">
    <div className="flex flex-wrap justify-center gap-10">
      <div className="max-w-sm px-6 py-4 bg-white rounded-lg shadow-lg border border-red-300">
        <h3 className="text-2xl text-red-800 font-semibold mb-3">Find Jobs</h3>
        <p className="text-gray-600">Quickly find job listings tailored to your location and preferences.</p>
      </div>
      <div className="max-w-sm px-6 py-4 bg-white rounded-lg shadow-lg border border-red-300">
        <h3 className="text-2xl text-red-800 font-semibold mb-3">Contact Employers</h3>
        <p className="text-gray-600">Get in touch with employers directly through our platform.</p>
      </div>
      <div className="max-w-sm px-6 py-4 bg-white rounded-lg shadow-lg border border-red-300">
        <h3 className="text-2xl text-red-800 font-semibold mb-3">Festive Spirit</h3>
        <p className="text-gray-600">Enjoy a job search experience wrapped in the warmth of the holiday season.</p>
      </div>
    </div>
  </section>
</div>
    </main>
  );
}