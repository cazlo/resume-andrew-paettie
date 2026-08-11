import React from 'react';
import PropTypes from 'prop-types';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import './Home.css';
import GridBackground from './GridBackground/GridBackground';
import appTheme from '../../common/techTheme';

const Home = ({ style }) => (
  <ScreenBlock id="Resume-home" style={style} className="ResumeHomeBlock">
    <div className="ResumeHomeBlock-headline-container">
      <div className="ResumeHomeBlock-headline ResumeHomeBlock-heading">
        <h1 className="Resume.im ResumeHomeBlock-heading">Drew Paettie</h1>
        <h2 className="ResumeHomeBlock-heading">Full-stack software engineer in Washington</h2>
      </div>
    </div>

    <div className="ResumeHomeBlock-squares">
      <GridBackground>
        <div style={{ ...appTheme.react.style }}>{appTheme.react.icon}</div>
        <div style={{ ...appTheme.nodeJs.style }}>{appTheme.nodeJs.icon}</div>
        <div style={{ ...appTheme.aws.style }}>{appTheme.aws.icon}</div>
        <div style={{ ...appTheme.docker.style }}>{appTheme.docker.heroIcon}</div>
        <div style={{ ...appTheme.python.style }}>{appTheme.python.icon}</div>
        <div style={{ ...appTheme.java.style }}>{appTheme.java.icon}</div>
        <div style={{ ...appTheme.rust.style }}>{appTheme.rust.icon}</div>
        <div style={{ ...appTheme.kubernetes.style }}>{appTheme.kubernetes.icon}</div>
        <div style={{ ...appTheme.go.style }}>{appTheme.go.heroIcon}</div>
        <div style={{ ...appTheme.terraform.style }}>{appTheme.terraform.heroIcon}</div>
        <div style={{ ...appTheme.postgres.style }}>{appTheme.postgres.heroIcon}</div>
        <div style={{ ...appTheme.githubActions.style }}>{appTheme.githubActions.icon}</div>
        <div style={{ ...appTheme.github.style }}>{appTheme.github.icon}</div>
        <div style={{ ...appTheme.typescript.style }}>{appTheme.typescript.heroIcon}</div>
        <div style={{ ...appTheme.linux.style }}>{appTheme.linux.heroIcon}</div>
        <div style={{ ...appTheme.redis.style }}>{appTheme.redis.heroIcon}</div>
        <div style={{ ...appTheme.grafana.style }}>{appTheme.grafana.heroIcon}</div>
        <div style={{ ...appTheme.prometheus.style }}>{appTheme.prometheus.icon}</div>
        <div style={{ ...appTheme.helm.style }}>{appTheme.helm.icon}</div>
        <div style={{ ...appTheme.flux.style }}>{appTheme.flux.icon}</div>
        <div style={{ ...appTheme.argocd.style }}>{appTheme.argocd.heroIcon}</div>
        <div style={{ ...appTheme.ansible.style }}>{appTheme.ansible.heroIcon}</div>
        <div style={{ ...appTheme.git.style }}>{appTheme.git.heroIcon}</div>
        <div style={{ ...appTheme.podman.style }}>{appTheme.podman.heroIcon}</div>
        <div style={{ ...appTheme.ubuntu.style }}>{appTheme.ubuntu.heroIcon}</div>
        <div style={{ ...appTheme.rockylinux.style }}>{appTheme.rockylinux.icon}</div>
        <div style={{ ...appTheme.opentelemetry.style }}>{appTheme.opentelemetry.icon}</div>
        <div style={{ ...appTheme.influxdb.style }}>{appTheme.influxdb.icon}</div>
        <div style={{ ...appTheme.gitea.style }}>{appTheme.gitea.icon}</div>
        <div style={{ ...appTheme.harbor.style }}>{appTheme.harbor.icon}</div>
        <div style={{ ...appTheme.renovate.style }}>{appTheme.renovate.icon}</div>
        <div style={{ ...appTheme.fastAPI.style }}>{appTheme.fastAPI.icon}</div>
        <div style={{ ...appTheme.redux.style }}>{appTheme.redux.icon}</div>
        <div style={{ ...appTheme.circleci.style }}>{appTheme.circleci.icon}</div>
      </GridBackground>
    </div>
  </ScreenBlock>
);

Home.propTypes = {
  style: PropTypes.shape({}),
};

Home.defaultProps = {
  style: {},
};

export default Home;
