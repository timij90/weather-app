// components/NavBar.js
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { selectedLanguageAtom, recentlyViewedAtom } from '../atom/atoms'; // Import atoms
import Link from 'next/link';

const NavBar = () => {
  const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
  const [recentlyViewed] = useAtom(recentlyViewedAtom);
  const [cityId, setCityId] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityId) {
      router.push(`/city/${cityId}`);
    }
  };

  const handleCityClick = (id) => {
    router.push(`/city/${id}`);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Link href="/" passHref>
        <Navbar.Brand>Weather App</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <NavDropdown title="Language" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={() => handleLanguageChange('en')}>English</NavDropdown.Item>
            <NavDropdown.Item onClick={() => handleLanguageChange('fr')}>French</NavDropdown.Item>
            <NavDropdown.Item onClick={() => handleLanguageChange('es')}>Spanish</NavDropdown.Item>
            <NavDropdown.Item onClick={() => handleLanguageChange('de')}>German</NavDropdown.Item>
            <NavDropdown.Item onClick={() => handleLanguageChange('it')}>Italian</NavDropdown.Item>
            <NavDropdown.Item onClick={() => handleLanguageChange('pt')}>Portuguese</NavDropdown.Item>
            <NavDropdown.Item onClick={() => handleLanguageChange('ar')}>Arabic</NavDropdown.Item>
            <NavDropdown.Item onClick={() => handleLanguageChange('zh')}>Chinese</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Previously Viewed" id="basic-nav-dropdown">
            {recentlyViewed.length > 0 ? recentlyViewed.map((id, index) => (
              <NavDropdown.Item key={index} onClick={() => handleCityClick(id)}>City: {id}</NavDropdown.Item>
            )) : <NavDropdown.Item>...</NavDropdown.Item>}
          </NavDropdown>
        </Nav>
        <Form className="d-flex" onSubmit={handleSearch}>
          <FormControl type="text" placeholder="City Name" className="mr-sm-2" value={cityId} onChange={(e) => setCityId(e.target.value)} />
          <Button type="submit" variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
