'use client'

import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'
import {useTranslations} from 'next-intl'
import * as React from 'react'

import {useAuth} from '@/components/context/auth-provider'
import {NavAdmin} from '@/components/features/layouts/sidebar/nav-admin'
import {NavMain} from '@/components/features/layouts/sidebar/nav-main'
import {NavProjects} from '@/components/features/layouts/sidebar/nav-projects'
import {NavUser} from '@/components/features/layouts/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import {PagesConst} from '@/env'
import {buildMenu, MenuData} from '@/lib/helper/menu-helper'
import {isPageEnabled} from '@/lib/utils'
import {isAdmin} from '@/services/authentication/auth-util'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('AppSidebar')
  const {user} = useAuth()

  // États dérivés avec mémorisation
  const isAdminUser = React.useMemo(() => isAdmin(user) ?? false, [user])

  // Génération du menu avec traductions
  const translatedMenuData: MenuData = React.useMemo(
    () => ({
      adminNavMain: [
        {
          title: t('admin.title'),
          url: '/admin',
          icon: Settings2,
          isActive: false,
        },
      ],
      navMain: [
        {
          title: t('account.title'),
          url: '#',
          icon: SquareTerminal,
          isActive: false,
          items: [
            ...(isPageEnabled(PagesConst.ACCOUNT)
              ? [
                  {
                    title: t('account.accountAndSecurity'),
                    url: '/account',
                  },
                ]
              : []),
            ...(isPageEnabled(PagesConst.SETTINGS)
              ? [
                  {
                    title: t('account.settings'),
                    url: '/account/settings',
                  },
                ]
              : []),
            ...(isPageEnabled(PagesConst.APIKEY)
              ? [
                  {
                    title: t('account.apiKeys'),
                    url: '/account/api-keys',
                  },
                ]
              : []),
            ...(isPageEnabled(PagesConst.SUBSCRIPTION)
              ? [
                  {
                    title: t('account.subscriptions'),
                    url: '/account/subscription',
                  },
                ]
              : []),
          ],
        },
        {
          title: t('projects.title'),
          url: '#',
          icon: SquareTerminal,
          isActive: true,
          items: [
            {
              title: t('projects.dashboard'),
              url: '/dashboard',
            },
          ],
        },
        {
          title: t('models.title'),
          url: '#',
          icon: Bot,
          items: [
            {
              title: 'Chat Llama3',
              url: '/chat',
            },
            {
              title: t('models.explorer'),
              url: '#',
            },
            {
              title: t('models.quantum'),
              url: '#',
            },
          ],
        },
        {
          title: t('documentation.title'),
          url: '#',
          icon: BookOpen,
          items: [
            {
              title: t('documentation.introduction'),
              url: '#',
            },
            {
              title: t('documentation.getStarted'),
              url: '#',
            },
            {
              title: t('documentation.tutorials'),
              url: '#',
            },
            {
              title: t('documentation.changelog'),
              url: '#',
            },
          ],
        },
      ],
      projects: [
        {
          name: t('projectsList.designEngineering'),
          url: '#',
          icon: Frame,
        },
        {
          name: t('projectsList.salesMarketing'),
          url: '#',
          icon: PieChart,
        },
        {
          name: t('projectsList.travel'),
          url: '#',
          icon: Map,
        },
      ],
    }),
    [t]
  )

  // Construction dynamique du menu avec mémorisation
  const menuItems = React.useMemo(
    () => buildMenu(translatedMenuData, 'default'),
    [translatedMenuData]
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* Logo ou titre de l'app ici */}</SidebarHeader>
      <SidebarContent>
        {isAdminUser && isPageEnabled(PagesConst.ADMIN) && (
          <NavAdmin adminItems={translatedMenuData.adminNavMain} />
        )}
        <NavMain items={menuItems} />
        <NavProjects projects={translatedMenuData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || undefined} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
