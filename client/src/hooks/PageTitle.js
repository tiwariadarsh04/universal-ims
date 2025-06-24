import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router'; 

const usePageTitle = () => {
  const location = useLocation(); 
  const { pathname } = location;

  const compnayName =  localStorage?.getItem('companyProfile') ? JSON.parse(localStorage?.getItem('companyProfile')) : ' ';
  const pageTitles = [
    { path: '/', title: 'Dashboard' },
    { path: '/welcome', title: compnayName?.name },
    { path: '/home', title: 'Noamundi Club' },
    { path: '/Inventory', title: 'Inventory Management' },
    { path: '/Bar-lounge', title: 'Bar Lounge' },
    { path: '/Bar-lounge/inventory', title: 'Bar Inventory' },
    { path: '/Bar-lounge/inventory/create', title: 'Create Bulk Item' },
    { path: '/invoice-billing', title: 'Insta Invoice' },
    { path: '/Kitchen', title: 'Kitchen' },
    { path: '/Snack-counter', title: 'Snacks Counter' },
    { path: '/report', title: 'All Report' },
    { path: '/report/sales', title: 'Sale Report' },
    { path: '/report/Purchase', title: 'Purchase Report' },
    { path: '/setting', title: 'Application Setting' },
    { path: '/member-managemnet', title: 'Member Management' },
    { path: '/event-management', title: 'Event Management' },
    { path: '/event-management/create', title: 'Event' },
    { path: '/my-profile', title: 'My Profile' },
    { path: '/create-member', title: 'Member Creation' },
    { path: '/all-transaction', title: 'Transactions' },
    { path: '/unauthorized', title: 'Unauthorized' },
    { path: '/all-transaction', title: 'Transactions' },
    { path: '/all-transaction/create', title: 'Multi Transactiob creation' }, 
    { path: '/member-managemnet/create', title: 'Multi Member Creation' },
    { path: '/Inventory/create', title: 'Multi Item Creation' },
    { path: '/application-user', title: 'Application Manager' },
    { path: '/menu-details', title: 'Explore Menu' },
    { path: '/Inventory/create-single', title: 'Add Item' },
    { path: '/Inventory/item/:itemCode', title: 'Item Details' },
    { path: '/transactions/log-activity', title: 'Activity Log' },
    { path: '/agenda-management', title: 'Calender Management' },
    { path: '/party-invoice-billing', title: 'Invoice Creation' },
    { path: '/party-management', title: 'Party Management' },
    { path: '/feedback-form-success', title: 'Thank You' },
    { path: '/documentation', title: 'Documentation Center' },
    { path: '/report/advance-analytics', title: 'Analytics Center' },
    { path: '/restaurant', title: 'Club Restaurant' },
    { path: '/swimming-pool', title: 'Swimming Pool' },
    { path: '/gym', title: 'Fitness Center' },
    { path: '/sports', title: 'Sports Complex' },
    { path: '/movies', title: 'Movie Theater' },
    { path: '/whats-new', title: "What's New" },
    { path: '/company-profile', title: "Company profile" },
    {path: '/terms-of-service', title: 'Terms of Service' },
    {path: '/privacy-policy', title: 'Privacy Policy' },
    {path: '/club-rules', title: 'Club Rules'},
    {path: '/cookie-policy', title: 'Cookies Policy' },
    {path: '/accessibility', title: 'Accessibility' },
    {path: '/about-us', title: 'About Us' },
    {path: '/backup-management', title: 'Data Backup' },

    { path: '/user-transactions/:userId', title: 'My Invoice' }, // Dynamic route
    { path: '/party-invoice/:id', title: 'Party Invoice' }, // Dynamic route
    { path: '/transaction-details/:inv', title: `Invoice Details` }, // Dynamic route
    { path: '/application-management', title: 'Application Management' }, // Dynamic route
    // Add more routes as needed
  ];

  // Find the matching route
  const matchedRoute = pageTitles.find((route) => {
    const match = matchPath({ path: route.path, end: true }, pathname); 
    return match !== null; // Return true if the route matches
  });

  // Get the page title based on the current route
  let pageTitle = 'Page Not Found';
  if (matchedRoute) {
    if (typeof matchedRoute.title === 'function') {
      // Extract route parameters and pass them to the title function
      const match = matchPath({ path: matchedRoute.path, end: true }, pathname);
      const params = match ? match.params : {};
      pageTitle = matchedRoute.title(params);
    } else {
      pageTitle = matchedRoute.title;
    }
  }

  return pageTitle;
};

export default usePageTitle;
