package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.util.AppConfig;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class AppBootstrap implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        AppConfig.init(sce.getServletContext());
    }
}
