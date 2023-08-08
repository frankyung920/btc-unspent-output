import express from 'express';
import * as bitcoin from 'bitcoinjs-lib';
import {
  RetrieveUnspentOutputResponse, UnspentOutput, RetrieveUnspentOutputError, retrieveUnspentOutputs,
} from '../client/client';

import { strategy0, strategy1, strategy2 } from '../strategy/strategy';

interface PrepareUnspentOutputsQueryParam {
  address: string;
  amount: number;
}

const validateBTCAddress = (address: string) => {
  try {
    // try to call a function to see whether it is valid address
    bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
  } catch (e) {
    return false;
  }
  return true;
};

const router = express.Router();

router.get('/api/prepare-unspent-outputs/', async (req, res) => {
  const { address, amount } = req.query as unknown as PrepareUnspentOutputsQueryParam;

  // check if amount valid
  if (!amount || Number.isNaN(+amount)) {
    res.status(400).send({
      error: 'Invalid amount',
    });
    return;
  }

  // try to check if valid BTC address
  if (!validateBTCAddress(address) || !address) {
    res.status(400).send({
      error: 'Invalid BTC address',
    });
    return;
  }

  const response = await retrieveUnspentOutputs(address);

  if ((response as RetrieveUnspentOutputError).message !== undefined) {
    res.status(400).send({
      error: 'Error when calling blockchain info api',
    });
    return;
  }
  const outputs: UnspentOutput[] = (response as RetrieveUnspentOutputResponse).unspent_outputs;
  outputs.sort((a, b) => a.value - b.value);

  const selectedOutputSt0 = strategy0(outputs, amount);
  if (selectedOutputSt0.length !== 0) {
    res.status(200).send(selectedOutputSt0);
    return;
  }

  const selectedOutputsSt1 = strategy1(outputs, amount);
  if (selectedOutputsSt1.length !== 0) {
    res.status(200).send(selectedOutputsSt1);
    return;
  }

  const selectedOutputSt2 = strategy2(outputs, amount);
  if (selectedOutputSt2) {
    res.status(200).send([selectedOutputSt2]);
    return;
  }

  res.status(409).send({ message: 'Not enough funds' });
});

export { router as prepareUnspentOutputsRouter };
