import { useLocation } from 'react-router-dom';
import { BreadcrumbChild, navigationItems } from '../config/navigation-config';

export interface BreadcrumbItem {
  label: string;
  path: string | null;
  isActive?: boolean;
}

export const useBreadcrumb = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const currentPath = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [];

    breadcrumbs.push({
      label: 'Home',
      path: currentPath === '/' ? null : '/',
      isActive: currentPath === '/',
    });

    if (currentPath === '/') {
      return breadcrumbs;
    }

    for (const navItem of navigationItems) {
      if (
        !navItem.path ||
        navItem.path === '/' ||
        navItem.breadcrumbConfig?.showInBreadcrumb === false
      ) {
        continue;
      }

      if (currentPath.startsWith(navItem.path)) {
        breadcrumbs.push({
          label: navItem.label,
          path: currentPath === navItem.path ? null : navItem.path,
          isActive: currentPath === navItem.path,
        });

        if (navItem.breadcrumbConfig?.children) {
          const childMatch = findMatchingChild(
            currentPath,
            navItem.breadcrumbConfig.children
          );

          if (childMatch) {
            breadcrumbs.push({
              label: childMatch.label,
              path: null,
              isActive: true,
            });
          }
        }

        break;
      }
    }

    return breadcrumbs;
  };

  return {
    breadcrumbs: generateBreadcrumbs(),
    currentPath: location.pathname,
  };
};

const findMatchingChild = (
  currentPath: string,
  children: BreadcrumbChild[]
) => {
  for (const child of children) {
    if (child.dynamic) {
      const pattern = child.path.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);

      if (regex.test(currentPath)) {
        return child;
      }
    } else {
      if (currentPath === child.path) {
        return child;
      }
    }
  }
  return null;
};
